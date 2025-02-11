package routes

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)


// This function just runs the echo server and set all the routes and 
// middlewares
func RunServer() {
	e := echo.New()
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
		},
		AllowHeaders: []string{
			"Content-Type",
		},
	}))

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.POST("/api/v0/public/login", Login)
	e.POST("/api/v0/public/signup", Signup)

	private := e.Group("/api/v0/private")
	private.Use(JWTMiddleware)
	private.Use(RBACMiddleware)

	e.Logger.Fatal(e.Start(":1323"))
}