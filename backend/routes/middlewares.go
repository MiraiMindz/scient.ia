package routes

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
	"backend/utils"
)


type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.StandardClaims
}

func RBACMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		user := c.Get("user")
		if user == nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "unauthorized"})
		}
		claims, ok := user.(*Claims)
		if !ok {
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "invalid token claims"})
		}

		reqPath := c.Request().URL.Path
		reqMethod := c.Request().Method

		allowed, err := utils.Enforcer.Enforce(claims.Role, reqPath, reqMethod)
		if err != nil {
			utils.Logger.Error("Error during enforcement", zap.Error(err))
			return c.JSON(http.StatusInternalServerError, map[string]string{"message": "authorization error"})
		}
		if !allowed {
			return c.JSON(http.StatusForbidden, map[string]string{"message": "access denied"})
		}

		return next(c)
	}
}

func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Missing token"})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid token format"})
		}

		tokenStr := parts[1]

		token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return utils.JWTKey, nil
		})
		if err != nil {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Wrong token"})
		}
		if !token.Valid {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid token"})
		}

		if claims, ok := token.Claims.(*Claims); ok {
			c.Set("user", claims)
		} else {
			return c.JSON(http.StatusUnauthorized, map[string]string{"message": "Invalid token claims"})
		}

		return next(c)
	}
}
