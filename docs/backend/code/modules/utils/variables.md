# Backend/Code/Modules/Roles/Variables

This file will explain all the variables related to the utilities, the structure of
a variable description will be the following:

- \[location\] `variable signature = value if any`

> variable description

example:

- \[/utils/folder/file.go:34\] `var Example string = "example"`

> This is an example variable

## Variables

- \[[backend/utils/variables.go:11](../../../../../backend/utils/variables.go#L11)\] `var JWTKey []byte`

> This is our global JSON Web Token (JWT) Signing Key

- \[[backend/utils/variables.go:13](../../../../../backend/utils/variables.go#L13)\] `var Logger *zap.Logger`

> This is our global logger
