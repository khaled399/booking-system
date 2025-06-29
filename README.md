# 🗓️ Booking System API

A simple and powerful RESTful API for managing service bookings, built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

- 🧑‍💻 User authentication & authorization (JWT)
- 🎭 Role-based access (Admin / User)
- 📅 Admin creates available booking slots
- 👤 User books available slots
- 📩 Email confirmation on booking
- ❌ User can cancel own bookings
- 📊 Admin dashboard with filters (date, service)
- ✅ Validation with express-validator
- 🔒 Protected routes with role control
- 📁 Clean structure & organized code

---

## ⚙️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Nodemailer
- Express-validator
- dotenv

---

## 🛠️ Installation
git clone https://github.com/khaled399/booking-system.git
cd booking-system
npm install
---


## 🚴‍♂️ Running the App
npm run dev

Or in production:
npm start
---



##🌐 API Structure

| Route                   | Method | Access | Description                  |
| ----------------------- | ------ | ------ | ---------------------------- |
| /api/auth/register      | POST   | Public | Register new user            |
| /api/auth/login         | POST   | Public | Login and receive JWT        |
| /api/bookings           | POST   | Admin  | Create new available slot    |
| /api/bookings/\:id/book | PATCH  | User   | Book available appointment   |
| /api/bookings/\:id      | DELETE | Admin  | Delete booking               |
| /api/bookings/\:id      | PATCH  | Admin  | Update booking status        |
| /api/user/bookings      | GET    | User   | View own bookings            |
| /api/admin/bookings     | GET    | Admin  | Admin dashboard with filters |


---

📁 .env Example
PORT=5000
DB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password
---

## ✍️ Author

**Khaled Ashraf**  
📧 khaled399@gmail.com  
🔗 [GitHub Profile](https://github.com/khaled399)
--


