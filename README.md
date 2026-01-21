# MERN Minima  🐱

A minimal MERN starter template featuring JWT authentication and a cat-themed frontend. This template helps you quickly set up a full-stack application with a modular folder structure.

---

## Quick Start

1. Clone the repository:
    ```bash
    git clone https://github.com/iamsaura8h/MERN-Minima.git
    ```
2. Remove the existing git folder:
    ```bash
    cd MERN-Minima
    rm -rf .git
    ```
3. Initialize a new git repository:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
4. Install dependencies in both directories:
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```
5. Add `.env` files with the following values:
    - **backend/.env**
      ```
      MONGO_URI=mongodb://localhost:27017/minima
      JWT_SECRET=your_jwt_secret
      ```
    - **frontend/.env**
      ```
      VITE_API_BASE_URL=http://localhost:5000
      VITE_CAT_API=https://cataas.com/cat?json=true
      ```
6. Start the backend and frontend servers:
    ```bash
    # In backend/
    node index.js

    # In frontend/
    npm run dev
    ```

Your MERN app is now ready for development.

--- 
## Features

- **Backend:** Express and MongoDB (ESM modules)
- **Frontend:** React, Vite, TypeScript, and Tailwind CSS
- JWT authentication with `username` and `password` (optional `email`)
- Protected routes (Home page)
- Dynamic navbar (shows login/logout)
- Landing page with random cat images
- Simple and easy-to-understand folder structure

---

## Folder Structure

```
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── index.js

frontend/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
├── .env
└── index.html
```

---
## API Endpoints (Backend)

| Method | Endpoint           | Description                       |
|--------|--------------------|-----------------------------------|
| POST   | `/api/auth/register` | Register a new user               |
| POST   | `/api/auth/login`    | Login and receive JWT token       |
| GET    | `/api/auth/me`       | Get current user info (protected) |
| GET    | `/api/cat`           | Get a random cat image            |

## Frontend Routes

| Path         | Component/Page      | Description                |
|--------------|--------------------|----------------------------|
| `/`          | Landing            | Cat-themed landing page    |
| `/login`     | Login              | User login form            |
| `/register`  | Register           | User registration form     |
| `/home`      | Home (Protected)   | Protected user dashboard   |
| `*`          | NotFound           | 404 fallback page          |

--- 
## Support & Contribute

If you find this project helpful, please consider giving it a ⭐ on [GitHub](https://github.com/iamsaura8h/MERN-Minima)!  
Your feedback, issues, and pull requests are always welcome.

Thank you for checking out MERN Minima! Happy coding! 