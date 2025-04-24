# Task Manager

## 🎯 Objective

The objective of this Task Manager is to provide a simple yet efficient tool for managing daily tasks.  
Users can:

- Create, read, update, and delete tasks (CRUD operations)
- Mark tasks as completed or pending
- Organize their workflow for better productivity

This application is designed with simplicity and usability in mind, helping users stay on top of their daily goals.

---

## 🛠️ Getting Started

Follow the steps below to set up the project locally.

### Step 1: Initialize the Project - npm init
### Step 2: npm i express mongoose dotenv cors express-validator
### Step 3: npm install --save-dev prettier for all files to show relevency style
### Step 4: "type":"module" , this should be added in package.json

├── src
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   └── projectMember.controller.js
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   └── config
├── .env
├── .prettierrc
└── package.json



Endpoints
POST /api/auth/register – Register a new user

POST /api/auth/login – Log in and receive JWT

Middleware to verify token and attach user to req.user

Project Controller
Handles creating, updating, and listing projects.

Endpoints
POST /api/project/create – Create a new project (Admin role only)

PUT /api/project/update/:projectId – Update a project's details

GET /api/project – Get all projects created by or assigned to the user

🧑‍💻 Author
Praharsh Pranjal
MERN Stack Developer

📜 License

This project is licensed under the MIT License.