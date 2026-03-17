# Resume Builder Web Application

A **full-stack resume builder** that allows users to create, edit, preview, and download professional resumes with customizable templates. Users can also upload profile pictures and manage multiple resumes.

---

## Demo Credentials

- Email : uday@mail.com
- Password : uday@123

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Running Locally](#running-locally)  
- [API Endpoints](#api-endpoints)  
- [Sample Resume JSON](#sample-resume-json)  
- [Project Structure](#project-structure)  
- [Frontend Usage](#frontend-usage)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- User authentication (Register / Login / JWT-based)  
- CRUD operations for resumes  
- Multiple sections: Profile Info, Contact Info, Work Experience, Education, Skills, Projects, Certifications, Languages, Interests  
- Upload profile images and resume thumbnails (stored on Cloudinary)  
- Resume preview and download  
- Theme customization for resumes  
- Step-by-step resume editing workflow  
- Responsive UI built with React and Tailwind CSS  

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios  
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT  
- **Cloud Services:** Cloudinary (for image uploads)  
- **Other Tools:** Vite, react-to-print  


---

## Getting Started

### Clone the repository

```bash
git clone <your-repo-url>
cd resumebuilder

cd backend
npm install
npm run dev

cd frontend/resume-builder
npm install
npm run dev
```

---

## Environmental Varialbes

### Backend

- PORT=5000
- MONGO_URI=<your-mongodb-uri>
- JWT_SECRET=<your-jwt-secret>
- CLIENT_URL=http://localhost:5173
- CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
- CLOUDINARY_API_KEY=<your-cloudinary-api-key>
- CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

### Frontend

- VITE_API_BASE_URL=http://localhost:5000


---

## Project Structure

```bash
backend/
 ├─ controllers/
 ├─ middlewares/
 ├─ models/
 ├─ routes/
 ├─ config/
 └─ server.js

frontend/
 ├─ src/
 │   ├─ components/
 │   ├─ pages/
 │   ├─ utils/
 │   └─ App.jsx
 └─ vite.config.js
```

