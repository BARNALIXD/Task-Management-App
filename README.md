Task Management App (React + Express + Prisma + NeonDB)
A full-stack app for sales teams to add, edit, track, and prioritize tasks by ROI. Built using React (frontend), Express.js (backend), Prisma ORM, and NeonDB/PostgreSQL.

Live Demo: task-management-appxd1128.netlify.app

Features
Add, edit, delete, and view tasks with details

Filter, search, and sort tasks by status, priority, or ROI (revenue ÷ time taken)

CSV import/export, undo delete, and summary metrics (performance grade, efficiency)

Persistent storage with PostgreSQL

Tech Stack
Frontend: React 18

Backend: Express.js

ORM: Prisma

Database: NeonDB (PostgreSQL)

Setup
Backend

cd backend

npm install

Create .env with your NeonDB/PostgreSQL connection string:

text
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
PORT=5000
npm run prisma:generate && npm run prisma:migrate

npm run dev

Frontend

cd frontend

npm install

(Optional) .env with:

text
REACT_APP_API_URL=http://localhost:5000/api
npm start

Intentional Bugs (Fix As Assignment)
Double fetch: Page loads trigger API twice (App.js, lines 42–49).

Undo Snackbar: Deleted task not cleared when snackbar closes (App.js, lines 105–143).

Unstable sorting: Tasks with same ROI/priority flicker (App.js, lines 145–164).

Dialog issue: Edit/Delete buttons open multiple dialogs at once (TaskItem.js, lines 6–20).

ROI calculation error: Division by zero returns NaN/Infinity (server.js, lines 14–18, 63, 102).

Quick Troubleshooting
Check DB connection string (sslmode=require for NeonDB)

Backend: Port 5000, run migrations

Frontend: API URL matches backend

Project Structure:

/backend (Prisma, Express)

/frontend (React Components)

README.md (Guide)

Assignment:

Find and fix the 5 bugs, commit changes cleanly.

ISC

