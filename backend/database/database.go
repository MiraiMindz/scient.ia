package database

import (
	"backend/models"
	"backend/utils"
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// This is the main database global variable it is used across the application
// to perform database access and operations
var Database *gorm.DB

// This is the database initializer, it creates or opens the database file, and
// also migrates all the models to the database
func Initialize() {
	var err error

	Database, err = gorm.Open(sqlite.Open("db/main.db"), &gorm.Config{})
	if err != nil {
		utils.Logger.Fatal(fmt.Sprintf("failed to open SQLite database: %v", err))
	}

	// MIGRATE USERS
	if err := Database.AutoMigrate(&models.User{}); err != nil {
		utils.Logger.Fatal(fmt.Sprintf("failed to migrate database schema: %v", err))
	}

	utils.Logger.Info("Database connection initialized and schema migrated.")
}
