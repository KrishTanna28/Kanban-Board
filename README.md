# Kanban Board

A full-stack collaborative Kanban Board application featuring smart task assignment, real-time updates, and sophisticated conflict resolution. Built with Node.js/Express (backend) and React (frontend).

## Project Overview

This Kanban Board is a modern task management system designed for real-time team collaboration. It combines intelligent task assignment algorithms with robust conflict resolution mechanisms to provide a seamless project management experience.

Key Highlights:
- Smart task assignment based on workload analysis and performance metrics
- Real-time collaboration with WebSocket integration
- Sophisticated conflict detection and resolution
- Comprehensive activity logging
- Mobile-responsive design

Live Demo:
- **Application**: [Kanban Board App](https://kanban-board-fc6s.onrender.com)
- **Demo Video**: [Watch Demo](https://drive.google.com/file/d/1uljQvUm8tZpyvYipJn-H7T3jkZD8U_eg/view)

## Tech Stack

### Frontend
- React.js for UI components
- Modern JavaScript (ES6+)
- CSS3 with custom animations
- Socket.io-client for real-time updates
- Responsive design with CSS Grid/Flexbox

### Backend
- Node.js runtime environment
- Express.js framework
- MongoDB with Mongoose ODM
- Socket.io for WebSocket connections
- JWT for authentication

### DevOps & Deployment
- Git version control
- Render for hosting
- MongoDB Atlas cloud database

## Features

- User registration and login (JWT authentication)
- Create, edit, delete, and assign tasks
- Drag-and-drop Kanban board (Todo, In Progress, Done)
- Real-time updates using WebSockets (Socket.io)
- Activity log panel for all task actions
- Conflict detection and resolution for concurrent edits
- Responsive, modern UI

---

## Tech Stack

- **Frontend:** React, CSS Modules
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Real-time:** Socket.io
- **Authentication:** JWT

---

## Folder Structure

```
Kanban-Board/
│
├── backend/
│   ├── config/           # Database config
│   ├── controllers/      # Route controllers (auth, tasks)
│   ├── middlewares/      # Auth middleware
│   ├── models/           # Mongoose models (User, Task, ActionLog)
│   ├── routes/           # Express routes (auth, tasks)
│   ├── utils/            # Utility functions (tokens, logging)
│   ├── server.js         # Main server entry
│   ├── package.json      # Backend dependencies
│   └── ...
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # React components (Board, Modals, TaskCard, etc.)
│   │   ├── utils/        # Socket.io client
│   │   ├── App.js        # Main app
│   │   └── ...
│   ├── package.json      # Frontend dependencies
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```
git clone https://github.com/KrishTanna28/Kanban-Board.git
cd Kanban-Board
```

### 2. Backend Setup
```
cd backend
npm install
```

- Create a `.env` file in `backend/` with the following:
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```
- Start the backend server:
  ```
  npm start
  ```

### 3. Frontend Setup
```
cd ../frontend
npm install
npm start
```
- The React app will run on [http://localhost:3000](http://localhost:3000)

---

## Smart Assignment System

The smart task assignment system uses a sophisticated algorithm that considers multiple factors:

### Workload Analysis
- Current number of assigned tasks per user
- Task completion rate and efficiency
- Priority distribution across team members
- Historical performance patterns

### Performance Metrics
- Average task completion time
- Success rate in meeting deadlines
- Task complexity handling capability
- Domain expertise and task type matching

### Availability Factors
- Current active status
- Time zone and working hours
- Recent activity patterns
- Team balance considerations

## Conflict Handling System

The conflict resolution system manages concurrent updates through a sophisticated merge strategy:

### Detection Mechanism
- Version tracking for each task
- Timestamp-based change detection
- Field-level difference analysis
- Change vector tracking

### Resolution Strategy
- Automatic merging of non-conflicting changes
- Interactive resolution for conflicting fields
- Preservation of all user intentions
- Change history maintenance

### User Interface
- Real-time conflict notifications
- Side-by-side comparison view
- Smart merge suggestions
- Audit trail of resolution decisions

## Usage Guide

### Getting Started
1. Register a new account or log in
2. Navigate the Kanban board (Todo, In Progress, Done)
3. Create your first task with priority and description
4. Assign tasks manually or use Smart Assign
5. Monitor the Activity Log for team updates

### Task Management
- Drag and drop tasks between status columns
- Edit task details with real-time updates
- Use Smart Assign for optimal task distribution
- Handle conflicts through the merge interface

### Collaboration Features
- Real-time updates across all connected clients
- Activity log showing team actions
- Smart notifications for important changes
- Conflict resolution for concurrent edits

---

## API Endpoints (Backend)

- `POST   /api/auth/register`   — Register a new user
- `POST   /api/auth/login`      — Login and get JWT
- `GET    /tasks/`              — Get all tasks
- `POST   /tasks/create-task`   — Create a new task
- `PUT    /tasks/update-task/:id` — Update a task (with conflict detection)
- `DELETE /tasks/delete-task/:id` — Delete a task
- `POST   /tasks/smart-assign/:id` — Smart assign a task
- `GET    /tasks/logs/recent`   — Get recent activity logs
- `GET    /tasks/:id`           — Get a single task (for conflict check)

---

## Environment Variables

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for JWT signing
- `PORT` — Backend server port (default: 5000)

---

## Customization
- Update styles in `frontend/src/components/*.css` for your branding.
- Add more columns or task fields as needed in the backend and frontend.

---

## License
MIT

---

## Author
- [KrishTanna28](https://github.com/KrishTanna28)

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---
