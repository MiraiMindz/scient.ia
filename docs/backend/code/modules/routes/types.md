# Backend/Code/Modules/Routes/Types

This file will explain all the types related to the routes, the structure of
a type description will be the following:

- \[location\] `type signature`

> type description

example:

- \[/utils/folder/file.go:34\] `type Example string`

> This is an example type

## Types

- \[[backend/routes/routes.go:22](../../../../../backend/routes/routes.go#L22)\]

```go
type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}
```

> This the the structure of the login request after decoding, it's used to
> reference the request in a type-safe way

- \[[backend/routes/routes.go:29](../../../../../backend/routes/routes.go#L29)\]

```go
type SignupRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}
```

> This the the structure of the signup request after decoding, it's used to
> reference the request in a type-safe way
