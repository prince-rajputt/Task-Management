📝 Task Management REST Application with Real-Time Updates
📌 Overview
![Task Managment Website ](Screenshot 2026-01-06 165326)

This project is a full-stack Task Management web application that allows users to create, view, update, and delete tasks. The application uses REST APIs for data operations and WebSockets (Socket.io) to provide real-time updates across all connected clients.

The main goal of this project is to learn and demonstrate full-stack development concepts including frontend development with React, backend development with Node.js and Express, database integration using PostgreSQL, and real-time communication.

🚀 Features

Create new tasks
View all tasks
Filter tasks by status (pending / in-progress / completed)
Update task status
Delete tasks
Real-time task updates using WebSocket (Socket.io)
RESTful API architecture
Basic input validation and error handling

🛠️ Tech Stack
Frontend
React.js
Axios
Socket.io Client
Backend
Node.js
Express.js
Socket.io
Database
PostgreSQL

Tools
VS Code

npm<img width="959" height="539" alt="Screenshot 2026-01-06 165326" src="https://github.com/user-attachments/assets/2f53fac6-6b83-4740-94dc-006c4678245c" />

pgAdmin

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/tasks	Create a new task
GET	/api/tasks	Get all tasks
GET	/api/tasks?status=pending	Filter tasks by status
PATCH	/api/tasks/:id	Update task status
DELETE	/api/tasks/:id	Delete a task
🗄️ Database Schema
Table: tasks
id (Primary Key)
title
description
status (pending / in-progress / completed)
createdAt
updatedAt

⚡ Real-Time Functionality

Socket.io is used to broadcast task events such as:
Task creation
Task updates
Task deletion
All connected clients receive updates instantly without page refresh.

▶️ How to Run the Project
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm start


Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:3000
