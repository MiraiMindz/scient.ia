# Backend/Code/Modules/Database/Functions

This file will explain all the functions related to the database, the structure of
a function description will be the following:

- \[location\] `function signature`

> function description

example:

- \[/utils/folder/file.go:34\] `func Example(variable string) error`

> This is an example function

## Functions

- \[[backend/database/database.go:118](../../../../../backend/database/database.go#L18)\] `func Initialize()`

> This is the database initializer, it creates or opens the database file, and
> also migrates all the models to the database
