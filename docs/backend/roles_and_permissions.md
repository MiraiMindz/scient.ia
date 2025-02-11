# Backend/Roles and Permissions

This document will explain all the roles in the system, their permissions and
their porpouse, this application uses CASBIN in the RBAC Pattern, so each role
is designated to exert some action in a API Route.

the structure of a role description will be the following:

- (ROLE) \[ACTIONS\] `OBJECT OR ROUTE`

> role description

example:

- (user) \[PUT, GET\] `/api/v0/private/example`

> This is a generic user role

## Roles and Permissions

- (Admin) \[*\] `*`

> The admin role can do anything in any object or route.

- (Instructor) \[GET, POST, PUT\] `/api/v0/private/courses`

> The instructor is a scoped administrator focused on courses and contents

- (Student) \[GET\] `/api/v0/private/courses`

> The student is a user with access to paid content

- (User) \[GET\] `/api/v0/private/freecourses`

> The user is a user that didn't signed a plan and only created an account
having access to only free content

- (Visitor) \[_\] `_`

> The visitor can't do nothing anywhere, it don't has access to the private
routes, it's the user that didn't created an account or logged-in yet,
