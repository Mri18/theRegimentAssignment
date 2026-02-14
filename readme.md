# 🚀 Advanced Todo Management System (Node.js)

A **production-style backend system** for managing Todos with secure authentication, authorization, real-time updates, and scalable architecture.

This project was built as a backend engineering assignment to demonstrate **real-world backend design patterns** and security best practices.

---

## 🧱 Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (Access & Refresh Tokens)
* Socket.IO (Real-time communication)
* Multer (Avatar upload)
* Cookie-based Authentication
* Rate Limiting
* RBAC (Role-Based Access Control)

---

## ✨ Key Features

### 🔐 Authentication & Security

* User Signup / Login
* Logout (single device)
* Logout from all devices
* Refresh token mechanism
* Password hashing (bcrypt)
* HttpOnly cookies
* Refresh tokens stored securely in DB
* Soft-deleted users cannot access protected APIs

---

### 👥 Roles & Authorization (RBAC)

Roles:

* USER
* ADMIN

Capabilities:

* Route-level authorization
* Admin-only APIs
* User-only APIs
* Shared APIs with permission checks

---

### 👤 User APIs

* Get own profile
* Update profile
* Upload avatar (multipart/form-data)
* Soft delete own account

Avatar upload:

* Stored locally (`/uploads/avatars`)
* Only image file types allowed

---

### 🛠 Admin APIs

* Get paginated list of users
* Update any user
* Soft delete users
* Restore deleted users

---

### ✅ Todo Management

Each Todo belongs to exactly one user.

* Create Todo
* Get own Todos (pagination supported)
* Update own Todo
* Delete own Todo

Security:

* Ownership checks enforced
* Users cannot access others’ todos

---

### ⚡ Real-time Updates (WebSocket)

Implemented with Socket.IO.

Users receive real-time events when:

* Todo created
* Todo updated
* Todo deleted

Only the **owner** of the todo receives updates.

---

### 🚦 Rate Limiting

Applied on authentication routes to prevent brute-force attacks.

---

## 📂 Project Structure

```
project/
│
├── modules/
│   ├── auth/
│   ├── users/
│   ├── admin/
│   └── todos/
│
├── middlewares/
├── socket/
├── uploads/
│   └── avatars/
│
├── tests/
│   └── socket-test.js
│
├── app.js
├── server.js
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in project root:

```
PORT=5000
MONGODB_URI=your_mongodb_connection

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

NODE_ENV=development
```

---

## ▶️ Run Locally (Step-by-Step)

### 1️⃣ Clone Repository

```
git clone <your-repo-url>
cd project-name
```

---

### 2️⃣ Install Dependencies

```
npm install
```

---

### 3️⃣ Start MongoDB

Make sure MongoDB is running:

* Local MongoDB
  OR
* MongoDB Atlas connection string

---

### 4️⃣ Start Server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

Health Check:

```
GET /health
```

---

## 🧪 API Quick Examples

### Signup

```
POST /auth/register
```

```json
{
  "name": "John",
  "email": "john@test.com",
  "password": "123456"
}
```

---

### Login

```
POST /auth/login
```

Returns:

* accessToken (HttpOnly cookie)
* refreshToken (HttpOnly cookie)

---

### Create Todo

```
POST /todos
```

```json
{
  "title": "Learn Node.js",
  "description": "Complete assignment"
}
```

---

### Get Todos (Pagination)

```
GET /todos?page=1&limit=10
```

---

## 🔌 WebSocket Testing

Run socket test client:

```
node tests/socket-test.js
```

Events received:

* `todoCreated`
* `todoUpdated`
* `todoDeleted`

---

## 🔒 Security Highlights

* JWT-based authentication
* Refresh token DB validation
* Soft delete enforcement
* Role-based authorization
* Ownership-based data access
* HttpOnly cookies
* Rate limiting

---

## 📌 Notes

* Avatar storage currently uses local filesystem.
* Easily extendable to Cloudinary / AWS S3.
* Project follows modular architecture:

```
Routes → Controllers → Services → Database
```

---

## 👨‍💻 Author

**Mrityunjay Jha**

---
