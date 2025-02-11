package utils

import (
	"github.com/casbin/casbin/v2"
	"go.uber.org/zap"
)

// This is our global CASBIN Enforcer
var Enforcer *casbin.Enforcer
// This is our global JSON Web Token (JWT) Signing Key
var JWTKey []byte
// This is our global logger
var Logger   *zap.Logger

// This is the list of roles policies
var RolesPoliciesList []RolePolicies = []RolePolicies{
	{ "admin", "*", "*" },
	{ "instructor", "/api/v0/private/courses", "GET" },
	{ "instructor", "/api/v0/private/courses", "POST" },
	{ "instructor", "/api/v0/private/courses", "PUT" },
	{ "student", "/api/v0/private/courses", "GET" },
	{ "user", "/api/v0/private/freecourses", "GET" },
}

