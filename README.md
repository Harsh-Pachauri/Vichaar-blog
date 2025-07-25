<h1 align="center">🧠 VICHAAR</h1>

<h4 align="center">
A Fullstack Open Source Blogging Platform built with the MERN Stack (MongoDB, Express, React, Node.js)
</h4>

<br/>

## 📌 Table of Contents

* [Configuration and Setup](#configuration-and-setup)
* [Key Features](#key-features)
* [Technologies Used](#technologies-used)

  * [Frontend](#frontend)
  * [Backend](#backend)
  * [Database](#database)

---

## ⚙️ Configuration and Setup

To run this project locally:

### 🧾 Prerequisites

* Node.js (v14 or above)
* MongoDB Atlas or Local MongoDB
* Cloudinary account (for image upload)
* A code editor (e.g., VS Code)



---

### 🖥 Clone and Install

```bash
git clone https://github.com/Harsh-Pachauri/Vichaar-blog.git
cd vichaar
```

Split your terminal into two for running frontend and backend separately.

### 📦 Frontend Setup

```bash
cd Frontend
npm install        # Install frontend dependencies
npm start          # Run React app at http://localhost:3000
```

### 🛠 Backend Setup

1. Navigate to the backend folder:

```bash
cd Backend
```

2. Create a `.env` file and configure the environment variables:

```env
# --- config.env ---

NODE_ENV=development
PORT=5000
URI=http://localhost:3000
MONGO_URI=your_mongo_connection_uri
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE=60m
RESET_PASSWORD_EXPIRE=3600000

# Nodemailer config
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USERNAME=example@gmail.com
EMAIL_PASS=your_email_password

# Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Run the backend server:

```bash
npm install          # Install backend dependencies
npm start            # Starts server on http://localhost:5000
```

---

## 🚀 Key Features

* 🧾 User Registration & Authentication (JWT)
* 📝 Rich Text Editor for Blogging (CKEditor)
* 🔍 Blog Search, Pagination, and Filtering
* 🔄 CRUD functionality for Blogs
* 📸 Image Upload via Cloudinary for Profiles & Blogs
* 📸 Upload Profile & Blog Images via Cloudinary
* ❤️ Like & Save Blogs (Reading List)
* 💬 Comment System
* 🔐 Protected Routes & Role-Based Access
* 📱 Fully Responsive UI
* ✨ Skeleton Loaders for smooth UX


---

## 🛠 Technologies Used

### 🖼️ Frontend

* **React.js** – Component-based SPA framework
* **React Hooks** – State & lifecycle management
* **react-router-dom** – Client-side routing
* **axios** – HTTP client for API requests
* **CSS** – Custom styles for UI
* **CKEditor** – Rich Text Editor for writing blogs
* **uuid** – Unique identifiers
* **react-icons** – Icon components for React

---

### ⚙️ Backend

* **Node.js** – JavaScript runtime
* **Express.js** – Web framework
* **Mongoose** – MongoDB object modeling
* **jsonwebtoken** – Secure authentication via tokens
* **bcryptjs** – Password hashing
* **nodemailer** – Email functionality (e.g. reset password)
* **dotenv** – Environment variable manager
* **multer** – Middleware for handling `multipart/form-data` (file uploads)
* **slugify** – URL-friendly slugs for blog titles
* **cors** – Cross-Origin Resource Sharing
* **express-async-handler** – Async error handling middleware

---

### 🗃️ Database

* **MongoDB Atlas** – NoSQL cloud database
* **Mongoose ODM** – Model layer for MongoDB collections

---

## 🌐 Live Demo

You can deploy this project using:

* [Render](https://render.com/) for Backend
* [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) for Frontend
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for Database
* [Cloudinary](https://cloudinary.com/) for Image Storage

---

## 🤝 Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests to improve the project.

---