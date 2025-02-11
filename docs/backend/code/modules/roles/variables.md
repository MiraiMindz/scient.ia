# Backend/Code/Modules/Roles/Variables

This file will explain all the variables related to the roles, the structure of
a variable description will be the following:

- \[location\] `variable signature = value if any`

> variable description

example:

- \[/utils/folder/file.go:34\] `var Example string = "example"`

> This is an example variable

## Variables

- \[[backend/utils/variables.go:16](../../../../../backend/utils/variables.go#L16)\]

```go
var RolesPoliciesList []RolePolicies = []RolePolicies{
    { "admin", "*", "*" },
    { "instructor", "/api/v0/private/courses", "GET" },
    { "instructor", "/api/v0/private/courses", "POST" },
    { "instructor", "/api/v0/private/courses", "PUT" },
    { "student", "/api/v0/private/courses", "GET" },
    { "user", "/api/v0/private/freecourses", "GET" },
}
```

> This is the list of roles policies
