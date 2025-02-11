package roles

import (
	"log"

	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"backend/utils"
)

// This function loads and defines all the policies/permissions for each role
func DefineRolePolicies(e *casbin.Enforcer, roles []utils.RolePolicies) error {
	for _, r := range roles {
		if ok, _ := e.HasPolicy(r.Role, r.Route, r.HttpVerb); !ok {
			if _, err := e.AddPolicy(r.Role, r.Route, r.HttpVerb); err != nil {
				return err
			}
		}
	}

    return e.SavePolicy()
}

// This function initializes the casbin enforcer which acts as a policy decision 
// point evaluating access control policies, basically asks the question:
// "Can X do Y?"
func SetupEnforcer() {
	db, err := gorm.Open(sqlite.Open("db/casbin.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to open SQLite database: %v", err)
	}

	adapter, err := gormadapter.NewAdapterByDB(db)
	if err != nil {
		log.Fatalf("failed to create Casbin adapter: %v", err)
	}

	e, err := casbin.NewEnforcer("roles/rbac_model.conf", adapter)
	if err != nil {
		log.Fatalf("failed to create Casbin enforcer: %v", err)
	}

	if err := e.LoadPolicy(); err != nil {
		log.Fatalf("failed to load Casbin policies: %v", err)
	}

	utils.Enforcer = e
}