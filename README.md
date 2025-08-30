# Task Scheduler Frontend (Vue 3 + Vite)

This is the **frontend** for the Task Scheduler project. It communicates with the Laravel backend API.

---

## Features

- Dashboard for managers
- Task management
- Users management
- Notifications (real-time)
- Task filters & search
- Pagination / infinite scroll
- Responsive UI with Bootstrap 5

---

## Prerequisites

- Node.js >= 18
- npm or yarn
- Access to running Laravel API

---

## Installation

Clone the repo: https://github.com/ArtakKspoyan1990/front-task-scheduling.git

```bash
git clone <frontend-repo-url> frontend
cd frontend
```

Install dependencies

```bash
npm install
# or
yarn
```

Copy .env.example to .env

```bash
VITE_PUSHER_APP_KEY=
VITE_PUSHER_APP_CLUSTER=ap2
VITE_BACKEND_URL=http://localhost:8000/api
```

Running the Frontend
```bash
npm run dev
# or
yarn dev
```
The frontend will run at: http://localhost:5173