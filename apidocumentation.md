# API Documentation — Mini ERP Backend

Base URL (local): `http://localhost:9005/api/v1`
Base URL (production): `<https://erpapi.softypy.com/>/api/v1`

Authentication uses **HTTP-only cookies** (`accessToken` / `refreshToken`) set on login. All protected routes below require a valid access token cookie, and the caller's `role` must be one of the roles listed under **Access**.

---

## Standard Response Format

**Success**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 50 }
}
```

**Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errorMessages": []
}
```

---

## Auth — `/api/v1/auth`

### POST `/auth/register`
Access: Public

Request
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "Password123!",
  "role": "employee"
}
```

Response
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "_id": "6a4d214b6610774b00f7be2d",
    "userId": "EMP002",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "employee",
    "status": "active"
  }
}
```

### POST `/auth/login`
Access: Public

Request
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt_access_token>",
    "needsPasswordChange": false
  }
}
```
> `accessToken` and `refreshToken` are also set as HTTP-only cookies on this response.

### POST `/auth/refresh-token`
Access: Public (requires a valid `refreshToken` cookie)

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "<new_jwt_access_token>"
  }
}
```

### POST `/auth/logout`
Access: Authenticated

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully",
  "data": null
}
```

### POST `/auth/change-password`
Access: Admin, Manager, Employee

Request
```json
{
  "oldPassword": "123456",
  "newPassword": "NewPass123!"
}
```

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null
}
```

### GET `/auth/me`
Access: Admin, Manager, Employee

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "6a4d14ef6610774b00f7bda1",
    "userId": "001",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "admin",
    "status": "active"
  }
}
```

---

## Users — `/api/v1/users`

### POST `/users`
Access: Admin

Request
```json
{
  "name": "Rahim",
  "email": "manager@gmail.com",
  "password": "Password123!",
  "role": "manager"
}
```

### GET `/users`
Access: Admin

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "6a4d14ef6610774b00f7bda1",
      "userId": "001",
      "name": "Admin",
      "email": "admin@gmail.com",
      "role": "admin",
      "status": "active",
      "needsPasswordChange": false,
      "isDeleted": false,
      "createdAt": "2026-07-07T15:02:07.788Z",
      "updatedAt": "2026-07-07T15:02:07.788Z"
    }
  ]
}
```

### GET `/users/:id`
Access: Admin

### PATCH `/users/:id`
Access: Admin

Request
```json
{
  "name": "Rahim Uddin",
  "status": "active"
}
```

### DELETE `/users/:id`
Access: Admin

---

## Products — `/api/v1/products`

### POST `/products`
Access: Admin, Manager, Employee*
Content-Type: `multipart/form-data`

> *Business rule per the assessment spec is Admin/Manager for product creation — confirm this matches your `auth()` call in `product.route.ts` before submitting, since the current code allows Employee as well.

Form fields:
| Field | Type | Required |
|---|---|---|
| `name` | text | Yes |
| `sku` | text | Yes |
| `category` | text | Yes |
| `purchasePrice` | number | Yes |
| `sellingPrice` | number | Yes |
| `stockQuantity` | number | Yes |
| `image` | file | Yes |

Response
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "_id": "6a4d3a1a6610774b00f7bfa0",
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "category": "Electronics",
    "purchasePrice": 500,
    "sellingPrice": 750,
    "stockQuantity": 40,
    "image": "https://res.cloudinary.com/.../wireless-mouse.jpg"
  }
}
```

### GET `/products`
Access: Admin, Manager, Employee

Query params: `searchTerm`, `page`, `limit`, `category`

Example: `/products?searchTerm=mouse&page=1&limit=10&category=Electronics`

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": [ { "_id": "...", "name": "Wireless Mouse", "stockQuantity": 40 } ],
  "meta": { "page": 1, "limit": 10, "total": 1 }
}
```

### GET `/products/:id`
Access: Admin, Manager, Employee

### PATCH `/products/:id`
Access: Admin, Manager, Employee*
Content-Type: `multipart/form-data` (image optional on update)

### DELETE `/products/:id`
Access: Admin, Manager, Employee*

---

## Sales — `/api/v1/sales`

### POST `/sales`
Access: Admin, Manager, Employee

Request
```json
{
  "customer": "6a4d2f1a6610774b00f7bea1",
  "items": [
    { "product": "6a4d3a1a6610774b00f7bfa0", "quantity": 2 },
    { "product": "6a4d3a2b6610774b00f7bfa5", "quantity": 1 }
  ]
}
```

Response
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Sale created successfully",
  "data": {
    "_id": "6a4d4b1a6610774b00f7c0a1",
    "customer": "6a4d2f1a6610774b00f7bea1",
    "items": [
      { "product": "6a4d3a1a6610774b00f7bfa0", "quantity": 2, "unitPrice": 750, "subtotal": 1500 },
      { "product": "6a4d3a2b6610774b00f7bfa5", "quantity": 1, "unitPrice": 300, "subtotal": 300 }
    ],
    "grandTotal": 1800,
    "createdAt": "2026-07-07T16:00:00.000Z"
  }
}
```

Error (insufficient stock)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Insufficient stock for product: Wireless Mouse",
  "errorMessages": []
}
```

### GET `/sales`
Access: Admin, Manager

### GET `/sales/:id`
Access: Admin, Manager

---

## Customers — `/api/v1/customers`

### POST `/customers`
Access: Admin, Manager

Request
```json
{
  "name": "John Doe",
  "phone": "01700000000",
  "email": "john@example.com",
  "address": "Dhaka, Bangladesh"
}
```

### GET `/customers`
Access: Admin, Manager, Employee

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Customers retrieved successfully",
  "data": [ { "_id": "...", "name": "John Doe", "phone": "01700000000" } ],
  "meta": { "page": 1, "limit": 10, "total": 1 }
}
```

### GET `/customers/:id`
Access: Admin, Manager, Employee

### PATCH `/customers/:id`
Access: Admin, Manager

### DELETE `/customers/:id`
Access: Admin, Manager

---

## Dashboard — `/api/v1/dashboard`

### GET `/dashboard/stats`
Access: Admin

Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalProducts": 42,
    "totalSales": 118,
    "lowStockProducts": 5
  }
}
```