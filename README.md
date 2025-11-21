# Intern Dashboard – React + Node.js + MongoDB

A scalable web application built for the **Frontend Developer Intern** assignment.

This project demonstrates:

- Modern **React.js** frontend with **Bootstrap** and responsive UI  
- **JWT-based authentication** (register, login, logout)  
- Protected dashboard with **CRUD operations** on tasks  
- **Node.js + Express** backend with **MongoDB (Mongoose)**  
- Password hashing, auth middleware, error handling  
- Clean, scalable folder structure suitable for production evolution  

---

## Tech Stack

**Frontend**

- React (Vite)
- React Router
- Context API (Auth state)
- Axios (API client)
- Bootstrap 5

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

---

## Features

### Authentication

- User **registration** with validation
- User **login** with JWT token
- **Protected routes** (dashboard, profile) – only accessible after login
- **Logout** clears token and user state

### Dashboard (Tasks)

- Create / Read / Update / Delete **tasks**
- Each task has: `title`, `description`, `status (pending | in-progress | completed)`
- **Search** tasks by title
- **Filter** tasks by status
- User-specific tasks (each user sees only their tasks)

### Profile

- Fetch logged-in user’s profile (`/users/me`)
- Update profile fields: `name`, `bio`
- Email is read-only

### Security

- Passwords **hashed** with bcrypt
- **JWT authentication** with `Authorization: Bearer <token>`
- Protected routes using middleware
- Structured error handling and validation on both client & server

---

## Folder Structure

```bash
intern-dashboard/
  backend/
    server.js
    package.json
    .env               # (you create this)
    src/
      config/
        db.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      models/
        User.js
        Task.js
      controllers/
        authController.js
        userController.js
        taskController.js
      routes/
        authRoutes.js
        userRoutes.js
        taskRoutes.js
      docs/
        api-docs.md

  frontend/
    package.json
    vite.config.js
    .env               # (you create this)
    src/
      main.jsx
      App.jsx
      api/
        axiosInstance.js
      context/
        AuthContext.jsx
      hooks/
        useAuth.js
      components/
        Navbar.jsx
        ProtectedRoute.jsx
        TaskForm.jsx
        TaskList.jsx
      pages/
        LoginPage.jsx
        RegisterPage.jsx
        DashboardPage.jsx
        ProfilePage.jsx
        NotFoundPage.jsx
      styles/
        custom.css
