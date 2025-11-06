# NeonDB Setup Guide

This guide will walk you through setting up NeonDB (serverless PostgreSQL) for your task management application.

## Step 1: Create a NeonDB Account

1. Go to [NeonDB website](https://neon.tech)
2. Sign up for a free account (you can use GitHub, Google, or email)
3. Complete the registration process

## Step 2: Create a New Project

1. Once logged in, click **"Create a project"** or **"New Project"**
2. Choose a project name (e.g., "task-management")
3. Select a region closest to you (for better performance)
4. Choose PostgreSQL version (default is fine)
5. Click **"Create project"**

## Step 3: Get Your Connection String

1. After the project is created, you'll see a dashboard
2. Look for a section called **"Connection Details"** or **"Connection String"**
3. You'll see something like:
   ```
   postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. Click **"Copy"** to copy the connection string

## Step 4: Configure Your Backend

1. Navigate to the `backend` folder in your project
2. Create a file named `.env` (if it doesn't exist)
3. Open the `.env` file and add:
   ```
   DATABASE_URL="your_connection_string_here"
   PORT=5000
   ```
   Replace `your_connection_string_here` with the connection string you copied from NeonDB

### Example `.env` file:
```
DATABASE_URL="postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb?sslmode=require"
PORT=5000
```

## Step 5: Run Database Migrations

1. Open a terminal in the `backend` folder
2. Run the following command to create the database tables:
   ```bash
   npm run prisma:migrate
   ```
3. When prompted, enter a migration name (e.g., "init" or "create_todos_table")
4. This will create the `todos` table in your NeonDB database (the table name remains 'todos' for database compatibility)

## Step 6: Verify the Setup

1. You can verify your database connection by running:
   ```bash
   npm run prisma:studio
   ```
   This opens Prisma Studio, a visual database browser where you can see your tables and data.

## Important Notes

- **Keep your connection string secret**: Never commit your `.env` file to version control
- **Free tier limits**: NeonDB free tier has limits but is sufficient for development
- **Connection pooling**: NeonDB handles connection pooling automatically
- **SSL required**: The connection string includes `?sslmode=require` for secure connections

## Troubleshooting

### Connection Errors
- Make sure your `.env` file is in the `backend` folder
- Verify the connection string is correct (no extra spaces)
- Check that your NeonDB project is active (not paused)

### Migration Errors
- Ensure Prisma Client is generated: `npm run prisma:generate`
- Make sure your DATABASE_URL is correct
- Check that you have internet connection

### Database Not Found
- Verify the database name in your connection string matches your NeonDB project
- In NeonDB dashboard, check the database name under "Connection Details"

## Next Steps

Once your database is set up:
1. Your backend server should connect automatically
2. Test the API by visiting `http://localhost:5000/api/health`
3. Start your frontend with `npm start` in the frontend folder
4. Your task management app should now be fully functional!

## Alternative: Using NeonDB Dashboard

You can also manage your database directly from the NeonDB dashboard:
1. Go to your NeonDB project dashboard
2. Click on **"SQL Editor"** to run SQL queries
3. Use **"Branching"** feature for database versioning (Pro feature)


