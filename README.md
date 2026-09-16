# NoteSpace

NoteSpace is a full-stack note-taking application built with a React frontend and an Express + MongoDB backend. Users can create accounts, sign in securely, and manage personal notes with create, read, update, and delete functionality.

## Features

- User registration and login
- JWT-based authentication
- Protected API routes for notes
- Create, read, update, and delete notes
- Search notes by title or content
- Responsive dashboard interface
- MongoDB persistence for users and notes

## Tech Stack

Frontend
- React
- Vite
- JavaScript

Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```bash
NoteSpace/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string
- npm installed

## Backend Setup

1. Go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notesapp
JWT_SECRET=your_super_secret_key
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

## Frontend Setup

1. Go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Notes

```http
GET /api/notes
GET /api/notes/:id
POST /api/notes
PUT /api/notes/:id
DELETE /api/notes/:id
```

All note routes require a valid JWT token in the `Authorization` header:

```http
Authorization: Bearer <token>
```

## Usage

1. Open the frontend in your browser.
2. Create a new account or log in.
3. Add notes with a title and content.
4. Edit or delete notes from the dashboard.
5. Search through your notes using the search bar.

## Notes

This project is intended as a simple full-stack notes app to demonstrate:

- Express API design
- MongoDB schema modeling
- React state management
- JWT authentication
- Protected resource access

## License

This project is for educational and portfolio use.
