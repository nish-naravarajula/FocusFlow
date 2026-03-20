# FocusFlow

A Pomodoro timer and task management application to help you stay focused and productive.

## Authors

- **Nishant Naravarajula** - Sessions, Authentication, Timer
- **Avijit Singh (Vee)** - Tasks, Calendar, Dashboard

## Class

[CS5610 - Web Development](https://johnguerra.co/classes/webDevelopment_online_spring_2026/) - Northeastern University, Spring 2026

## Project Objective

FocusFlow helps users manage their time and tasks using the Pomodoro technique. Users can:

- Start timed focus sessions (work/break)
- Track session history and streaks
- View weekly productivity stats
- Manage tasks with deadlines
- Monitor progress with visual dashboards

## Screenshot

![FocusFlow Home Page](images/image.png)

## Live Demo

https://focusflow-1-pnq8.onrender.com/home

## Tech Stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express 5
- **Database:** MongoDB (native driver)
- **Authentication:** JWT, bcryptjs

## Features

- User registration and login
- Pomodoro timer with customizable duration
- Work/Break session types
- Session history with delete functionality
- Weekly sessions graph
- Streak and stats tracking
- Responsive design

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account or local MongoDB

### Clone the repository

```bash
git clone https://github.com/nish-naravarajula/FocusFlow.git
cd FocusFlow
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
FocusFlow/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/       # Login, Register
│   │   │   ├── Nav/        # NavBar, NavItem, TaskBar
│   │   │   ├── Sessions/   # SessionsGraph, SessionHistory, StreakDisplay
│   │   │   ├── Tasks/      # TaskItem
│   │   │   └── Timer/      # Timer
│   │   ├── pages/          # Home, Focus, Tasks
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── db/                 # Database connection
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   ├── seed/               # Database seeding
│   ├── index.js
│   └── package.json
├── .prettierrc
├── LICENSE
└── README.md
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Sessions

- `GET /api/sessions` - Get all user sessions
- `GET /api/sessions/stats` - Get user stats and streaks
- `POST /api/sessions` - Create new session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Tasks

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
