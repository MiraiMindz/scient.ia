# Backend/Routes

Here is the documentation of each route in the backend

This is the layout of a route in the server: `/api/${VERSION}/${SCOPE}/${ROUTE}`

one example is: `/api/v0/public/login`, this defines the first version of the public login route.

here is the struct of a route in this docs:

- \[HTTP VERBS\] `/api/${VERSION}/${SCOPE}/${ROUTE}` (parameters: parameter type) -> return type
  - RETURN STATUS: `RETURN VALUE`

> explanation of the route

```tsx
// CURL REQUEST

typescript request code...
```

example:

- \[POST, GET\] `/api/v0/public/example` (`{ name: string }: JSON`) -> `JSON`
  - **400**: `{ message: string = "Invalid something" }`
  - **401**: `{ message: string = "Invalid other thing" }`
  - **500**: `{ message: string = "Internal error" }`
  - **200**: `{ value: number = 42 }`

> This is an example route that checks something

```tsx
// curl -X POST "https://${SERVER}:${PORT}/api/v0/public/example" -H "Content-Type: application/json" -d '{"name": "example"}'

try {
    const response = await fetch("https://${SERVER}:${PORT}/api/v0/public/example", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "example" }),
    });

    const result: { value: number } = await response.json();
    console.log(result);
} catch (error) {
    console.error("Error:", error);
}
```

---

## Routes

### Authentication

#### \[POST\] `/api/v0/public/login` (`{ email: string, password: string }: plaintext`) -> `JSON`

- **400**: `{ message: string = "Failed to read request body" }`
- **400**: `{ message: string = "Invalid Base64 encoding" }`
- **400**: `{ message: string = "Invalid JSON format" }`
- **401**: `{ message: string = "Invalid credentials" }`
- **500**: `{ message: string = "Internal error" }`
- **200**: `{ token: string = JSONWebToken }`

> This is the login route which can't be bearer protected because it returns the token for the /protected/* routes. The parameters must stringfied and converted to base64.

```tsx
// curl -X POST "https://${SERVER}:${PORT}/api/v0/public/login" -H "Content-Type: application/plaintext" --data "$(echo -n '{"email":"example@email.com","password":"password"}' | base64)"

try {
    const response = await fetch("https://${SERVER}:${PORT}/api/v0/public/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/plaintext",
        },
        body: btoa(JSON.stringify({ email: "example@email.com", password: "password" })),
    });

    const result: { token: string } = await response.json();
    console.log(result);
} catch (error) {
    console.error("Error:", error);
}
```

#### \[POST\] `/api/v0/public/signup` (`{ email: string, password: string }: plaintext`) -> `JSON`

- **400**: `{ message: string = "Failed to read request body" }`
- **400**: `{ message: string = "Invalid Base64 encoding" }`
- **400**: `{ message: string = "Invalid JSON format" }`
- **400**: `{ message: string = "User already exists" }`
- **500**: `{ message: string = "Internal error" }`
- **500**: `{ message: string = "Error processing password" }`
- **500**: `{ message: string = "Error creating user" }`
- **500**: `{ message: string = "Internal error" }`
- **500**: `{ message: string = "Could not create token" }`
- **200**: `{ token: string = JSONWebToken }`

> This is the signup route which can't be bearer protected because it returns the token for the /protected/* routes. The parameters must stringfied and converted to base64.

```tsx
// curl -X POST "https://${SERVER}:${PORT}/api/v0/public/signup" -H "Content-Type: application/plaintext" --data "$(echo -n '{"email":"example@email.com","password":"password"}' | base64)"

try {
    const response = await fetch("https://${SERVER}:${PORT}/api/v0/public/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/plaintext",
        },
        body: btoa(JSON.stringify({ email: "example@email.com", password: "password" })),
    });

    const result: { token: string } = await response.json();
    console.log(result);
} catch (error) {
    console.error("Error:", error);
}
```
