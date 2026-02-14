🚀 Advanced Todo Management System (Node.js)

A production-style backend system for managing Todos with authentication, authorization, real-time updates, and secure architecture.

Built as a backend assignment focusing on real-world backend patterns.

🧱 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication (Access + Refresh Tokens)

Socket.IO (Real-time events)

Multer (Avatar Upload)

Rate Limiting

Cookie-based Auth

RBAC (Role-Based Access Control)

✨ Features
🔐 Authentication & Security

Signup

Login

Logout (single device)

Logout from all devices

Refresh token flow

Password hashing (bcrypt)

HttpOnly cookies

Refresh tokens stored securely in DB

Soft-deleted users cannot access APIs

👥 Roles & RBAC

Roles:

USER

ADMIN

Features:

Route-level role protection

Admin-only APIs

User-only APIs

👤 User APIs

Get own profile

Update profile

Upload avatar image (multipart/form-data)

Soft delete own account

Avatar:

Stored locally (/uploads/avatars)

Only image files allowed

🛠 Admin APIs

Get paginated list of users

Update any user

Soft delete user

Restore user

✅ Todo APIs

Each todo belongs to exactly one user.

Create todo

Get own todos (pagination)

Update own todo

Delete own todo

Security:

Ownership checks enforced

Users cannot modify others’ todos

⚡ Real-time (WebSocket)

Using Socket.IO:

User receives real-time events when:

Todo created

Todo updated

Todo deleted

Only the owner receives events.

🚦 Rate Limiting

Applied on:

Authentication routes

Prevents brute-force attacks.

📂 Project Structure
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
⚙️ Environment Variables

Create .env file:

PORT=5000
MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

NODE_ENV=development
▶️ Setup Instructions
1️⃣ Clone Repository
git clone <repo-url>
cd project-name
2️⃣ Install Dependencies
npm install
3️⃣ Start MongoDB

Make sure MongoDB is running locally or use cloud URI.

4️⃣ Run Server
npm run dev

Server runs at:

http://localhost:5000

Health check:

GET /health
🧪 API Examples
Signup
POST /auth/register

Body:

{
  "name": "John",
  "email": "john@test.com",
  "password": "123456"
}
Login
POST /auth/login

Returns HttpOnly cookies:

accessToken

refreshToken

Create Todo
POST /todos

Body:

{
  "title": "Learn Node.js",
  "description": "Complete assignment"
}
Get Todos (Pagination)
GET /todos?page=1&limit=10
🔌 WebSocket Testing

Run:

node tests/socket-test.js

Events:

todoCreated

todoUpdated

todoDeleted

🧠 Security Highlights

JWT authentication

Refresh token DB validation

Soft delete enforcement

Role-based authorization

Ownership checks

HttpOnly cookies

Rate limiting

📌 Notes

Avatar upload currently uses local storage.

Easily extendable to Cloudinary/S3.

👨‍💻 Author

Backend implementation by Mrityunjay Jha