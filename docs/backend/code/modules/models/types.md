# Backend/Code/Modules/Models/Types

This file will explain all the types related to the models, the structure of
a type description will be the following:

- \[location\] `type signature`

> type description

example:

- \[/utils/folder/file.go:34\] `type Example string`

> This is an example type

## Types

- \[[backend/utils/types.go:4](../../../../../backend/utils/types.go#L4)\]

```go
type User struct {
    gorm.Model
    Email    string `json:"email"`
    Password string `json:"password"`
    Role     string `json:"role"`
}
```

> This is the User model, it represents a user in the database, it's used to
> migrate, add and retrieve users from the database in a type-safe way.
