package routes

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"net/http"
	"time"

	"backend/models"
	"backend/utils"
	"backend/database"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
)

// This the the structure of the login request after decoding, it's used to
// reference the request in a type-safe way
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// This the the structure of the signup request after decoding, it's used to
// reference the request in a type-safe way
type SignupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// This is the login route handler
func Login(c echo.Context) error {
	var req LoginRequest

	// Here we decode the body and associate the JSON to the req variable.
	base64Body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Failed to read request body"})
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(string(base64Body))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid Base64 encoding"})
	}

	if err := json.Unmarshal(decodedBytes, &req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid JSON format"})
	}

	// Here we validate/check if the user actually exists in the database
	var user models.User
	if err := database.Database.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid credentials"})
	}

	// Compare the hashed password stored in the database with the provided password.
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid credentials"})
	}

	// Check if the user's grouping policy is already set in Casbin; if not, add it.
	hasPolicy, err := utils.Enforcer.HasGroupingPolicy(req.Email, user.Role)
	if err != nil {
		utils.Logger.Error("error checking grouping policy", zap.Error(err))
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Internal error"})
	}

	if !hasPolicy {
		_, err = utils.Enforcer.AddGroupingPolicy(req.Email, user.Role)
		if err != nil {
			utils.Logger.Error("failed to add grouping policy", zap.Error(err))
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Internal error"})
		}
		utils.Enforcer.SavePolicy()
	}

	// creates the JSON Web Token (JWT) 
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		Email: user.Email,
		Role:  user.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
			Issuer:    "Scient.ia",
		},
	})

	tokenString, err := token.SignedString(utils.JWTKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Could not create token"})
	}

	// if everything succeeds return the JWT.
	return c.JSON(http.StatusOK, map[string]string{
		"token": tokenString,
	})
}

// This is the signup route handler
func Signup(c echo.Context) error {
	var req SignupRequest

	// Here we decode the body and associate the JSON to the req variable.
	base64Body, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Failed to read request body"})
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(string(base64Body))
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid Base64 encoding"})
	}

	if err := json.Unmarshal(decodedBytes, &req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid JSON format"})
	}

	// Here we validate/check if the user actually exists in the database
	var existingUser models.User
	if err := database.Database.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "User already exists"})
	}

	// Hash the password.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error processing password"})
	}

	newUser := models.User{
		Email:     req.Email,
		Password:  string(hashedPassword),
		Role:      "user",
	}

	// add our newly created user to the main database
	if err := database.Database.Create(&newUser).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error creating user"})
	}

	// Add the user's role to Casbin grouping policies if not already set.
	hasPolicy, err := utils.Enforcer.HasGroupingPolicy(req.Email, "user")
	if err != nil {
		utils.Logger.Error("error checking grouping policy", zap.Error(err))
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Internal error"})
	}

	if !hasPolicy {
		_, err = utils.Enforcer.AddGroupingPolicy(req.Email, "user")
		if err != nil {
			utils.Logger.Error("failed to add grouping policy", zap.Error(err))
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Internal error"})
		}
		utils.Enforcer.SavePolicy()
	}

	// Generate JSON Web Token (JWT) with email and role.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, Claims{
		Email: newUser.Email,
		Role:  newUser.Role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
			Issuer:    "Scient.ia",
		},
	})

	
	tokenString, err := token.SignedString(utils.JWTKey)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Could not create token"})
	}

	// if everything succeeds return the JWT.
	return c.JSON(http.StatusOK, map[string]string{
		"token": tokenString,
	})
}
