# COMP3133 – Employee Management System - GraphQL API

This project is a backend **Employee Management System** built with **Node.js**, **Express**, **GraphQL (Apollo Server)** and **MongoDB Atlas**.

It includes:
- User **Signup** and **Login**
- Employee **CRUD** (Create, Read, Update, Delete)
- Search employees by **ID**, **designation**, or **department**
- Employee profile pictures uploaded to **Cloudinary** and stored as a URL in MongoDB

---

## Tech Stack
- Node.js + Express
- GraphQL (Apollo Server)
- MongoDB Atlas + Mongoose
- Cloudinary (image hosting)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- express-validator (validation)
- Postman (testing)

---

## How to run
Create a .env file in the project root 
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

### GraphQL Endpoint
http://localhost:3000/graphql

