# Finance Dashboard API Documentation

This document provides a detailed breakdown of all available endpoints, required authentication headers, and JSON body payloads for testing.

---

## 1. Authentication APIs

You do not need a token to hit these endpoints.

### Register a User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Description**: Creates a new user. The `role` defaults to `Viewer` if omitted.
- **Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin" 
}
```
*(Valid roles: `"Admin"`, `"Analyst"`, `"Viewer"`)*

### Login
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Description**: Authenticates a user and returns a JSON Web Token (JWT).
- **Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## Authorization Header Requirement
For **all endpoints below**, you must include the token received from the Login API in your HTTP Headers:
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

---

## 2. User Management APIs (Admin Only)

### List Users
- **Method**: `GET`
- **URL**: `/api/users`
- **Description**: Returns a list of all registered users and their details.
- **Body**: No body required.

### Update User Role
- **Method**: `PUT`
- **URL**: `/api/users/:id/role`
- **Description**: Promotes or demotes a user's access level. Replace `:id` with the User ID.
- **Body**:
```json
{
  "role": "Analyst"
}
```

### Update User Status
- **Method**: `PUT`
- **URL**: `/api/users/:id/status`
- **Description**: Activates or deactivates a user account.
- **Body**:
```json
{
  "status": "Inactive"
}
```
*(Valid statuses: `"Active"`, `"Inactive"`)*

---

## 3. Financial Records APIs

### Create a Record (Admin Only)
- **Method**: `POST`
- **URL**: `/api/records`
- **Body**:
```json
{
  "amount": 1500.50,
  "type": "Income", 
  "category": "Salary",
  "date": "2026-04-01T10:00:00.000Z", 
  "notes": "April salary payment" 
}
```
*(Note: `type` must be `"Income"` or `"Expense"`. `date` and `notes` are optional).*

### Get All Records (All Users)
- **Method**: `GET`
- **URL**: `/api/records`
- **Description**: Retrieves records. Supports query parameters for filtering and pagination.
- **Example Usage**: `/api/records?page=1&limit=10&type=Income&category=Salary`
- **Body**: No body required.

### Update a Record (Admin Only)
- **Method**: `PUT`
- **URL**: `/api/records/:id`
- **Description**: Updates specific fields on an existing record. Replace `:id` with the Record ID.
- **Body**:
```json
{
  "amount": 2000,
  "category": "Bonus"
}
```

### Delete a Record (Admin Only)
- **Method**: `DELETE`
- **URL**: `/api/records/:id`
- **Description**: Permanently deletes a record.
- **Body**: No body required.

---

## 4. Dashboard APIs

### Get Aggregated Summary (Admin & Analyst)
- **Method**: `GET`
- **URL**: `/api/dashboard/summary`
- **Description**: Returns calculations for total income, total expense, and overall net balance.
- **Body**: No body required.

### Get Category Totals (Admin & Analyst)
- **Method**: `GET`
- **URL**: `/api/dashboard/category-totals`
- **Description**: Returns net balances grouped by categories.
- **Body**: No body required.

### Get Recent Activity (All Users)
- **Method**: `GET`
- **URL**: `/api/dashboard/recent`
- **Description**: Returns the 5 most recently created financial records.
- **Body**: No body required.
