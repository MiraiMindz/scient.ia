package models

import "gorm.io/gorm"

// This is the User model, it represents a user in the database, it's used to
// migrate, add and retrieve users from the database in a type-safe way.
type User struct {
	gorm.Model
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}
