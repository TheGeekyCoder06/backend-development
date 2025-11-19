# auth-express

A simple authentication and user management backend built with Express.js.

**Live Demo:**  
https://auth-five-taupe.vercel.app

---

## Description
This backend includes everything needed for basic auth and user handling:
- Register & login
- JWT authentication
- Protected and admin-only routes
- Password change
- Image upload, fetch, and delete
- Clean structure and Vercel-ready setup

---

## Tech Stack
- Node.js  
- Express.js  
- MongoDB  
- JWT  
- Multer  
- Cloudinary / Local Uploads  

---

## Features
- User registration and login  
- JWT-based authentication  
- Protected routes for authenticated users  
- Admin-only route access  
- Change password  
- Upload, view, and delete images  
- Easily deployable on Vercel  

---

## Environment Variables
Create a `.env` file and add:

PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

CLOUD_NAME=your_cloudinary_cloud
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

---

## Installation
```bash
git clone https://github.com/TheGeekyCoder06/auth-express
cd auth-express
npm install
npm start
Base URL:

https://auth-five-taupe.vercel.app
API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT
POST	/api/auth/change-password	Change password (token required)

Home Routes
Method	Endpoint	Description
GET	/api/home/welcome	Public welcome route
GET	/api/home/get-users	Get all users (protected)

Admin Routes
Method	Endpoint	Description
GET	/api/admin/welcome	Admin-only route

Image Routes
Method	Endpoint	Description
POST	/api/images/upload	Upload image (protected)
GET	/api/images/get	Fetch all uploaded images
DELETE	/api/images/delete/:id	Delete image by ID (protected)

Testing
A complete Postman collection is available in:

Copy code
postman-tests/
Import it into Postman to test registration, login, protected routes, uploads, and deletion.

Deployment
The project includes a vercel.json file.
Add your environment variables in the Vercel dashboard and deploy.

Author
Developed by Harshith M (TheGeekyCoder06).