A full-stack task management application built with MERN stack using Next.js.

SETUP :
run npm install in both client folder and server folder
In client folder create .env.local file with content `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
npm run dev to start : App runs on `http://localhost:3000`

IN server folder create .env file with content 
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development   
```                     
npm run dev to start server

Features :
User Authentication (Register/Login/Logout with JWT)
Create, Read, Update, Delete Tasks
Search tasks by title or description
Filter tasks by status (To Do, In Progress, Done)

Assumptions :
Users must register before using the app
Tasks are private to each user
Email addresses must be unique
Passwords must be at least 6 characters
Task titles are required (max 100 chars)
Task descriptions are optional (max 500 chars)


This project was created as part of a hiring assignment.