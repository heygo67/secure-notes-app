# Secure Notes App

A full-stack web application that allows users to write, encrypt, and manage secure notes.

This project focuses on demonstrating core secure development practices including client-side encryption, JWT-based authentication, and input sanitization.

---

## Tech Stack

- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express
- **Storage**: Temporary in-memory storage (used for demo purposes)
  - Can be extended to use MongoDB for persistence

---

## Features

- User registration and login
  - Passwords are hashed using bcrypt
  - Stateless authentication with JWT
    - Refresh tokens securely stored and rotated on expiration

- Note encryption
  - Notes (title and body) are encrypted with AES in the browser
  - Only encrypted data is sent to the backend

- Decryption toggle
  - Users can toggle between viewing raw encrypted notes or decrypted content

- Input sanitization
  - Decrypted notes are sanitized using DOMPurify to prevent XSS attacks

- Secure HTTP headers
  - Helmet is used on the backend to apply common security-related headers

- Access control
  - Backend routes are protected via JWT middleware

- Light/Dark mode toggle
  - Users can switch themes dynamically

- In-memory note storage
  - All data is stored temporarily in memory for the duration of the server session
  - No data is persisted after server restart

---

## Project Structure and Separation of Concerns

- UI components are isolated in `/components` with no business logic
- API calls are abstracted in reusable utility modules
- Authentication handled with middleware and dedicated `/auth` routes
- Encryption, token logic, and sanitization are encapsulated in `utils/`
- Clear distinction between frontend UI, backend API, and auth layers

---

## Purpose

This application was created to demonstrate the fundamentals of secure full-stack development, including:
- Client-side encryption
- Stateless authentication
- Secure API design
- Safe rendering practices in the browser

---

## Security Practices

- Passwords hashed using bcrypt before storage
- JWT-based stateless authentication with refresh token rotation
- Notes encrypted client-side with AES before transmission
- All decrypted content sanitized with DOMPurify before rendering
- Backend protected by JWT middleware and security headers via Helmet

---

## Getting Started

### Backend Setup

```bash
cd backend
npm install
```

#### Create a .env file in the backend folder:

```
JWT_SECRET=your_secret_key
PORT=5000
```

#### Start the backend server:

```bash
npm start
```

### Frontend Setup

(in a new terminal)
```bash
cd frontend
npm install
```

#### Create a .env file in the frontend folder:

```
REACT_APP_API_URL=http://localhost:5000
```

#### Start the frontend server:

```bash
npm start
```

---

## Demo Behavior

This version uses in-memory storage. All user data and notes will be lost upon server restart. For persistence, integrate MongoDB or another database and update backend logic accordingly.

### Try it here

[https://secure-notes-app-frontend.onrender.com]

---

## Future Improvements

- Persistent storage with MongoDB
- Editable notes
- User profiles
- Rate limiting and account lockout mechanisms
