# Task Management Application

A full-stack Task Management application built with React, Express.js, Prisma, and NeonDB (PostgreSQL). Manage and organize your tasks efficiently.

## Features

### Core Functionality
- ✅ Add, edit, and delete tasks
- ✅ View task details and notes
- ✅ Search & filter by status and priority
- ✅ Calculate ROI = Revenue ÷ Time Taken
- ✅ Sort tasks by ROI and priority
- ✅ View summary insights (total revenue, efficiency, average ROI, performance grade)
- ✅ Import & export tasks via CSV
- ✅ Undo delete using a snackbar
- ✅ Persistent storage with PostgreSQL database

### Task Fields
- Title
- Notes
- Revenue ($)
- Time Taken (hours)
- ROI (calculated automatically)
- Priority (High, Medium, Low)
- Status (Pending, In Progress, Completed)

## Tech Stack

- **Frontend**: React 18
- **Backend**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL (NeonDB recommended)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A PostgreSQL database (NeonDB account recommended - free tier available)

---

## 🚀 Setup Instructions

### 1. Clone/Download the Project

```bash
cd task-management
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Set up PostgreSQL Database

**Option A: Using NeonDB (Recommended - Free)**
1. Go to [NeonDB](https://neon.tech/) and create a free account
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)

**Option B: Local PostgreSQL**
1. Install PostgreSQL locally
2. Create a new database
3. Note your connection string

#### Step 4: Create `.env` file

Create a file named `.env` in the `backend` directory with the following content:

```env
DATABASE_URL="your_postgresql_connection_string_here"
PORT=5000
```

**Example:**
```env
DATABASE_URL="postgresql://username:password@ep-cool-cloud-123456.us-east-2.aws.neon.tech/taskdb?sslmode=require"
PORT=5000
```

#### Step 5: Generate Prisma Client
```bash
npm run prisma:generate
```

#### Step 6: Run database migrations
```bash
npm run prisma:migrate
```

This will create the `tasks` table in your database.

#### Step 7: Start the backend server
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Step 1: Open a new terminal and navigate to frontend directory
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: (Optional) Create `.env` file

Create a file named `.env` in the `frontend` directory if you want to customize the API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If you don't create this file, it will default to `http://localhost:5000/api`.

#### Step 4: Start the frontend development server
```bash
npm start
```

The frontend will run on `http://localhost:3000` and should automatically open in your browser.

---

## 🐛 Known Bugs (Assignment)

This application contains **5 intentional bugs** that need to be fixed:

### BUG 1: Double Fetch Issue
**Location**: `frontend/src/App.js` (lines 42-49)
**Description**: The API fetch runs twice on page load
**Impact**: Unnecessary API calls, performance degradation

### BUG 2: Undo Snackbar Bug
**Location**: `frontend/src/App.js` (lines 105-143)
**Description**: Deleted task state not cleared when snackbar closes
**Impact**: Undo restores wrong/old tasks

### BUG 3: Unstable Sorting
**Location**: `frontend/src/App.js` (lines 145-164)
**Description**: Tasks with same ROI/priority flicker/reorder randomly
**Impact**: Jittery UI, inconsistent user experience

### BUG 4: Double Dialog Opening
**Location**: `frontend/src/components/TaskItem.js` (lines 6-20)
**Description**: Edit/Delete buttons trigger both action + view dialogs
**Impact**: Multiple dialogs open simultaneously

### BUG 5: ROI Calculation Errors
**Location**: `backend/server.js` (lines 14-18, 63, 102)
**Description**: Division by zero causes Infinity/NaN values
**Impact**: Invalid ROI displays, broken calculations

---

## 📁 Project Structure

```
task-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (Task model)
│   ├── server.js                  # Express.js API server
│   ├── package.json
│   └── .env                       # Environment variables (create this)
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.js        # Form for creating tasks
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskList.js        # List container + dialogs
│   │   │   ├── TaskList.css
│   │   │   ├── TaskItem.js        # Individual task card
│   │   │   ├── TaskItem.css
│   │   │   ├── SummaryInsights.js # Dashboard metrics
│   │   │   ├── SummaryInsights.css
│   │   │   ├── Snackbar.js        # Undo notification
│   │   │   └── Snackbar.css
│   │   ├── App.js                 # Main application
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env                       # Environment variables (optional)
└── README.md
```

---

## 🔌 API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/summary/insights` - Get summary metrics
- `GET /api/health` - Health check

---

## 🗄️ Database Schema

### Task Model

| Field      | Type     | Description                          |
|------------|----------|--------------------------------------|
| id         | String   | Primary key (auto-generated)         |
| title      | String   | Task title                           |
| notes      | String?  | Optional task notes                  |
| revenue    | Float    | Revenue amount ($)                   |
| timeTaken  | Float    | Time spent (hours)                   |
| roi        | Float    | Calculated ROI                       |
| priority   | String   | High, Medium, or Low                 |
| status     | String   | Pending, In Progress, or Completed   |
| createdAt  | DateTime | Creation timestamp                   |
| updatedAt  | DateTime | Last update timestamp                |

---

## 🛠️ Development Scripts

### Backend
```bash
npm start              # Start production server
npm run dev            # Start with nodemon (auto-reload)
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio GUI
```

### Frontend
```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
```

---

## 🎯 Task Sorting Logic

Tasks are sorted using the following priority:

1. **Primary sorter**: ROI (descending)
2. **Secondary sorter**: Priority (High > Medium > Low)
3. **Tie-breaker**: ⚠️ **MISSING** (causes BUG 3)

---

## 📊 Performance Grade Calculation

| Average ROI | Grade |
|-------------|-------|
| >= 100      | A+    |
| >= 75       | A     |
| >= 50       | B     |
| >= 25       | C     |
| >= 10       | D     |
| < 10        | F     |

---

## 🚨 Troubleshooting

### Backend won't start
- Check if PostgreSQL database is accessible
- Verify `DATABASE_URL` in `.env` is correct
- Run `npm run prisma:generate` again
- Ensure port 5000 is not already in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` in frontend `.env`

### Prisma migration errors
- Delete `prisma/migrations` folder
- Run `npm run prisma:migrate` again
- If using NeonDB, ensure SSL mode is enabled

### Database connection issues
- Verify your connection string has `?sslmode=require` for NeonDB
- Test connection string using Prisma Studio: `npm run prisma:studio`

---

## 📝 Notes for Assignment

- All 5 bugs are clearly marked with comments in the code
- Each bug affects different aspects: UI, logic, and performance
- Fix all bugs to ensure the app is stable and user-friendly
- Test your fixes thoroughly before deployment
- Remember to commit your changes properly (not one giant commit)

---

## 📄 License

ISC

