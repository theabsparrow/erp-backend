# ERP Backend — API Documentation

**Base URL (Production):** `https://your-backend-link.vercel.app/api/v1`  
**Base URL (Local):** `http://localhost:5000/api/v1`

---

## 📋 Table of Contents

- [Authentication](#-authentication)
- [Users](#-users)
- [Roles](#-roles)
- [Permissions](#-permissions)
- [Categories](#-categories)
- [Products](#-products)
- [Sales](#-sales)
- [Dashboard](#-dashboard)
- [Error Responses](#-error-responses)
- [Permissions Reference](#-permissions-reference)

---

## 🔐 Authentication Header

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: <accessToken>
```

> The access token is returned from the login endpoint. Refresh tokens are stored in an `httpOnly` cookie automatically.

---

## 🔑 Authentication

### POST `/auth/login`

Login with email and password.

**Auth required:** No

**Request Body:**
```json
{
  "email": "admin@erp.com",
  "password": "Admin@1234"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt_access_token>"
  }
}
```

> A `refreshToken` is also set as an `httpOnly` cookie.

---

### POST `/auth/logout`

Logout the current user and clear the refresh token cookie.

**Auth required:** No

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged out successfully",
  "data": null
}
```

---

### POST `/auth/refresh-token`

Get a new access token using the refresh token stored in the cookie.

**Auth required:** No (uses `httpOnly` cookie)

**Success Response `200`:**
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

---

### PATCH `/auth/change-password`

Change the currently logged-in user's own password.

**Auth required:** Yes — Permission: `auth_change_password`

**Request Body:**
```json
{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": null
}
```

---

### PATCH `/auth/admin/change-password`

Admin forcefully changes any user's password.

**Auth required:** Yes — Role: `Admin`

**Request Body:**
```json
{
  "userId": "<user_id>",
  "newPassword": "NewPass@123"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User password updated successfully",
  "data": null
}
```

---

## 👤 Users

### GET `/users/me`

Get the currently authenticated user's profile.

**Auth required:** Yes — Role: `Admin`, `Manager`, `Employee`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "<user_id>",
    "name": "John Doe",
    "email": "john@erp.com",
    "phone": "01700000000",
    "role": { "_id": "<role_id>", "name": "Admin" },
    "profilePicture": "https://res.cloudinary.com/...",
    "status": "active"
  }
}
```

---

### PATCH `/users/me`

Update the currently authenticated user's own profile.

**Auth required:** Yes — Role: `Admin`, `Manager`, `Employee`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `name` | string | No |
| `phone` | string | No |
| `profilePicture` | file (image) | No |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": { ...updatedUser }
}
```

---

### POST `/users`

Create a new user.

**Auth required:** Yes — Permission: `create_user`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@erp.com",
  "phone": "01700000003",
  "password": "Pass@1234",
  "role": "<role_id>",
  "status": "active"
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | Yes |
| `email` | string (email) | Yes |
| `phone` | string | Yes |
| `password` | string (min 6) | Yes |
| `role` | string (ObjectId) | Yes |
| `status` | `"active"` \| `"block"` | No |

**Success Response `201`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": { ...createdUser }
}
```

---

### GET `/users`

Get all users with pagination and filtering.

**Auth required:** Yes — Permission: `view_user`

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `searchTerm` | string | Search by name or email |
| `sort` | string | Sort field (e.g. `-createdAt`) |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPage": 3
  },
  "data": [ ...users ]
}
```

---

### GET `/users/:id`

Get a single user by ID.

**Auth required:** Yes — Permission: `view_user`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": { ...user }
}
```

---

### PATCH `/users/:id`

Update a user by ID.

**Auth required:** Yes — Permission: `update_user`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `name` | string | No |
| `email` | string (email) | No |
| `phone` | string | No |
| `role` | string (ObjectId) | No |
| `status` | `"active"` \| `"block"` | No |
| `profilePicture` | file (image) | No |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User updated successfully",
  "data": { ...updatedUser }
}
```

---

### DELETE `/users/:id`

Soft delete a user by ID.

**Auth required:** Yes — Permission: `delete_user`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User deleted successfully",
  "data": { ...deletedUser }
}
```

---

## 🎭 Roles

### POST `/roles`

Create a new role.

**Auth required:** Yes — Permission: `create_role`

**Request Body:**
```json
{
  "name": "Supervisor",
  "description": "Manages daily operations",
  "status": "active",
  "permissions": ["view_product", "view_sale"]
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | Yes |
| `description` | string | Yes |
| `status` | `"active"` \| `"freeze"` | No |
| `permissions` | string[] | No |

**Success Response `201`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Role created successfully",
  "data": { ...createdRole }
}
```

---

### GET `/roles`

Get all roles.

**Auth required:** Yes — Permission: `view_role`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Roles fetched successfully",
  "data": [
    {
      "_id": "<role_id>",
      "name": "Admin",
      "description": "Has full access to all permissions",
      "status": "active",
      "permissions": ["create_role", "view_role", "..."]
    }
  ]
}
```

---

### GET `/roles/:id`

Get a single role by ID.

**Auth required:** Yes — Permission: `view_role`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role fetched successfully",
  "data": { ...role }
}
```

---

### PATCH `/roles/:id`

Update a role. Use `addPermissions` to grant and `removePermissions` to revoke permissions.

**Auth required:** Yes — Permission: `update_role`

**Request Body:**
```json
{
  "name": "Supervisor",
  "description": "Updated description",
  "status": "active",
  "addPermissions": ["create_sale"],
  "removePermissions": ["delete_product"]
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | No |
| `description` | string | No |
| `status` | `"active"` \| `"freeze"` | No |
| `addPermissions` | string[] | No |
| `removePermissions` | string[] | No |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role updated successfully",
  "data": { ...updatedRole }
}
```

---

### DELETE `/roles/:id`

Delete a role by ID.

**Auth required:** Yes — Permission: `delete_role`

> ⚠️ The `Admin` role is protected and cannot be deleted.

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Role deleted successfully",
  "data": { ...deletedRole }
}
```

---

## 🔒 Permissions

### GET `/permissions`

Get all available system permissions.

**Auth required:** Yes — Permission: `view_role`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Permissions fetched successfully",
  "data": [
    "create_role",
    "update_role",
    "delete_role",
    "view_role",
    "create_user",
    "view_user",
    "update_user",
    "delete_user",
    "create_product",
    "update_product",
    "view_product",
    "delete_product",
    "create_category",
    "update_category",
    "view_category",
    "delete_category",
    "create_sale",
    "view_sale",
    "update_sale",
    "delete_sale",
    "auth_change_password"
  ]
}
```

---

## 🗂️ Categories

### POST `/categories`

Create a new category.

**Auth required:** Yes — Permission: `create_product`

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

| Field | Type | Required |
|---|---|---|
| `name` | string | Yes |
| `description` | string | Yes |

**Success Response `201`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "_id": "<category_id>",
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "isDeleted": false
  }
}
```

---

### GET `/categories`

Get all categories.

**Auth required:** Yes — Permission: `view_category`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories fetched successfully",
  "data": [ ...categories ]
}
```

---

### GET `/categories/:id`

Get a single category by ID.

**Auth required:** Yes — Permission: `view_category`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category fetched successfully",
  "data": { ...category }
}
```

---

### PATCH `/categories/:id`

Update a category by ID.

**Auth required:** Yes — Permission: `update_category`

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": { ...updatedCategory }
}
```

---

### DELETE `/categories/:id`

Soft delete a category by ID.

**Auth required:** Yes — Permission: `delete_category`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category deleted successfully",
  "data": { ...deletedCategory }
}
```

---

## 📦 Products

### POST `/products`

Create a new product with an image upload.

**Auth required:** Yes — Permission: `create_product`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `name` | string | Yes |
| `sku` | string | Yes |
| `category` | string (ObjectId) | Yes |
| `purchasePrice` | number | Yes |
| `sellingPrice` | number | Yes |
| `stockQuantity` | number | Yes |
| `image` | file (image) | Yes |

**Success Response `201`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "_id": "<product_id>",
    "name": "Laptop",
    "sku": "LAP-001",
    "category": "<category_id>",
    "purchasePrice": 800,
    "sellingPrice": 1200,
    "stockQuantity": 50,
    "image": "https://res.cloudinary.com/...",
    "isDeleted": false
  }
}
```

---

### GET `/products`

Get all products with pagination and filtering.

**Auth required:** Yes — Permission: `view_product`

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |
| `searchTerm` | string | Search by name or SKU |
| `sort` | string | Sort field (e.g. `-createdAt`) |
| `category` | string | Filter by category ID |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products fetched successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 40,
    "totalPage": 4
  },
  "data": [ ...products ]
}
```

---

### GET `/products/:id`

Get a single product by ID.

**Auth required:** Yes — Permission: `view_product`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product fetched successfully",
  "data": { ...product }
}
```

---

### PATCH `/products/:id`

Update a product by ID.

**Auth required:** Yes — Permission: `update_product`

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required |
|---|---|---|
| `name` | string | No |
| `sku` | string | No |
| `category` | string (ObjectId) | No |
| `purchasePrice` | number | No |
| `sellingPrice` | number | No |
| `stockQuantity` | number | No |
| `image` | file (image) | No |

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product updated successfully",
  "data": { ...updatedProduct }
}
```

---

### DELETE `/products/:id`

Soft delete a product by ID.

**Auth required:** Yes — Permission: `delete_product`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product deleted successfully",
  "data": { ...deletedProduct }
}
```

---

## 🛒 Sales

### POST `/sales`

Create a new sale. Automatically deducts stock and captures a product snapshot.

**Auth required:** Yes — Permission: `create_sale`

**Request Body:**
```json
{
  "items": [
    { "productId": "<product_id>", "quantity": 2 },
    { "productId": "<product_id>", "quantity": 1 }
  ]
}
```

| Field | Type | Required |
|---|---|---|
| `items` | array (min 1) | Yes |
| `items[].productId` | string (ObjectId) | Yes |
| `items[].quantity` | integer (min 1) | Yes |

**Success Response `201`:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Sale created successfully",
  "data": {
    "_id": "<sale_id>",
    "soldBy": "<user_id>",
    "items": [
      {
        "productId": "<product_id>",
        "name": "Laptop",
        "sku": "LAP-001",
        "image": "https://res.cloudinary.com/...",
        "sellingPrice": 1200,
        "quantity": 2,
        "subtotal": 2400
      }
    ],
    "grandTotal": 2400,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### GET `/sales`

Get all sales.

**Auth required:** Yes — Permission: `view_sale`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Sales fetched successfully",
  "data": [ ...sales ]
}
```

---

### GET `/sales/:id`

Get a single sale by ID.

**Auth required:** Yes — Permission: `view_sale`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Sale fetched successfully",
  "data": { ...sale }
}
```

---

## 📊 Dashboard

### GET `/dashboard/stats`

Get aggregated business statistics.

**Auth required:** Yes — Role: `Admin`, `Manager`

**Success Response `200`:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard statistics fetched successfully",
  "data": {
    "overview": {
      "totalProducts": 40,
      "totalSales": 120,
      "totalUsers": 10,
      "totalCategories": 5,
      "totalRevenue": 150000,
      "totalOrders": 120,
      "averageOrderValue": 1250.00
    },
    "lowStockProducts": [
      {
        "_id": "<product_id>",
        "name": "Laptop",
        "sku": "LAP-001",
        "stockQuantity": 2,
        "image": "https://res.cloudinary.com/..."
      }
    ],
    "topSellingProducts": [
      {
        "_id": "<product_id>",
        "name": "Laptop",
        "sku": "LAP-001",
        "totalQuantitySold": 35,
        "totalRevenue": 42000
      }
    ],
    "salesByDay": [
      {
        "_id": "2025-01-01",
        "totalSales": 5,
        "totalRevenue": 6000
      }
    ]
  }
}
```

> `lowStockProducts` includes products with `stockQuantity < 5`.  
> `topSellingProducts` returns the top 5 best-selling products.  
> `salesByDay` returns the last 7 days of sales data.

---

## ❌ Error Responses

All errors follow a consistent structure:

```json
{
  "success": false,
  "statusCode": <code>,
  "message": "<error message>",
  "errorSources": [
    {
      "path": "<field or route>",
      "message": "<specific error detail>"
    }
  ]
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad Request — validation failed or missing required fields |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — insufficient role or permission |
| `404` | Not Found — resource does not exist |
| `409` | Conflict — duplicate key (e.g. email already exists) |
| `500` | Internal Server Error |

---

## 🔒 Permissions Reference

| Permission | Description |
|---|---|
| `create_role` | Create a new role |
| `update_role` | Update an existing role |
| `delete_role` | Delete a role |
| `view_role` | View roles and permissions |
| `create_user` | Create a new user |
| `update_user` | Update any user |
| `delete_user` | Delete a user |
| `view_user` | View users |
| `create_product` | Create a product or category |
| `update_product` | Update a product |
| `delete_product` | Delete a product |
| `view_product` | View products |
| `create_category` | Create a category |
| `update_category` | Update a category |
| `delete_category` | Delete a category |
| `view_category` | View categories |
| `create_sale` | Create a sale |
| `update_sale` | Update a sale |
| `delete_sale` | Delete a sale |
| `view_sale` | View sales |
| `auth_change_password` | Change own password |

### Default Role Permissions

| Role | Permissions |
|---|---|
| **Admin** | All permissions |
| **Manager** | `create_product`, `update_product`, `view_product`, `delete_product` |
| **Employee** | `view_product`, `create_sale`, `view_sale`, `update_sale`, `delete_sale` |
