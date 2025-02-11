# Backend/Code/Modules/Database/Variables

This file will explain all the variables related to the database, the structure of
a variable description will be the following:

- \[location\] `variable signature = value if any`

> variable description

example:

- \[/utils/folder/file.go:34\] `var Example string = "example"`

> This is an example variable

## Variables

- \[[backend/database/database.go:14](../../../../../backend/database/database.go#L14)\] `var Database *gorm.DB`

> This is the main database global variable it is used across the application
> to perform database access and operations
