package main

import (
	"os"
	"runtime"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"backend/utils"
	"backend/roles"
	"backend/routes"
	"backend/database"
)

// This is the init function, it runs before the main function and just set-ups
// everything for the server to run, it loads .env variables, migrate the
// databases and setup the policies, roles and logger.
func init() {
	runtime.GOMAXPROCS(runtime.NumCPU())
	utils.SetupLogger()
	database.Initialize()
	err := godotenv.Load(".env")
	if err != nil {
		utils.Logger.Error("Error loading .env file")
	}

	utils.JWTKey = []byte(os.Getenv("SCIENTIAPRIVATERSAKEY"))

	roles.SetupEnforcer()

	if err := roles.DefineRolePolicies(utils.Enforcer, utils.RolesPoliciesList); err != nil {
		utils.Logger.Error("failed to define role policies", zap.Error(err))
	}
}

// The main function
func main() {
	routes.RunServer()
	defer utils.Logger.Sync()
}
