# Kanban Board

A full-stack collaborative Kanban Board application with real-time updates, user authentication, activity logging, and conflict resolution. Built with Node.js/Express (backend) and React (frontend).

---

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

## Usage
- Register a new user or log in.
- Create, edit, and drag tasks between columns.
- Assign tasks to users.
- See real-time updates as other users interact.
- View the activity log for all actions.
- If two users edit the same task, a conflict modal will appear to resolve changes.

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

## Screenshots
_Add screenshots of your app here for a better README!_
