# Backend/Code/Modules/Roles/Functions

This file will explain all the functions related to the roles, the structure of
a function description will be the following:

- \[location\] `function signature`

> function description

example:

- \[/utils/folder/file.go:34\] `func Example(variable string) error`

> This is an example function

## Functions

- \[[backend/roles/roles.go:14](../../../../../backend/roles/roles.go#L14)\] `func DefineRolePolicies(e *casbin.Enforcer, roles []utils.RolePolicies) error`

> This function loads and defines all the policies/permissions for each role

- \[[backend/roles/roles.go:29](../../../../../backend/roles/roles.go#L29)\] `func SetupEnforcer()`

> This function initializes the casbin enforcer which acts as a policy decision
> point evaluating access control policies, basically asks the question:
> "Can X do Y?"
