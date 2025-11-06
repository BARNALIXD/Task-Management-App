const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to calculate ROI safely (avoid division by zero/NaN)
const calculateROI = (revenue, timeTaken) => {
  const rev = Number(revenue) || 0;
  const time = Number(timeTaken) || 0;
  if (time <= 0) return 0;
  const roi = rev / time;
  return Number.isFinite(roi) ? roi : 0;
};

// Routes

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET single task by id
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, notes, revenue, timeTaken, priority, status } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Calculate ROI safely
    const roi = calculateROI(revenue, timeTaken);

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        notes: notes?.trim() || null,
        revenue: parseFloat(revenue) || 0,
        timeTaken: parseFloat(timeTaken) || 0,
        roi: roi,
        priority: priority || 'Medium',
        status: status || 'Pending',
      },
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, notes, revenue, timeTaken, priority, status } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (notes !== undefined) updateData.notes = notes?.trim() || null;
    if (revenue !== undefined) updateData.revenue = parseFloat(revenue) || 0;
    if (timeTaken !== undefined) updateData.timeTaken = parseFloat(timeTaken) || 0;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    // Recalculate ROI if revenue or timeTaken changed
    if (revenue !== undefined || timeTaken !== undefined) {
      const currentTask = await prisma.task.findUnique({ where: { id } });
      const newRevenue = revenue !== undefined ? parseFloat(revenue) || 0 : currentTask.revenue;
      const newTimeTaken = timeTaken !== undefined ? parseFloat(timeTaken) || 0 : currentTask.timeTaken;
      updateData.roi = calculateROI(newRevenue, newTimeTaken);
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });
    res.json(task);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await prisma.task.delete({
      where: { id },
    });
    res.json(deletedTask);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// GET summary insights
app.get('/api/tasks/summary/insights', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();

    const totalRevenue = tasks.reduce((sum, task) => sum + task.revenue, 0);
    const totalTime = tasks.reduce((sum, task) => sum + task.timeTaken, 0);
    const avgROI = tasks.length > 0 ? tasks.reduce((sum, task) => sum + task.roi, 0) / tasks.length : 0;
    const efficiency = totalTime > 0 ? totalRevenue / totalTime : 0;

    // Calculate performance grade
    let grade = 'F';
    if (avgROI >= 100) grade = 'A+';
    else if (avgROI >= 75) grade = 'A';
    else if (avgROI >= 50) grade = 'B';
    else if (avgROI >= 25) grade = 'C';
    else if (avgROI >= 10) grade = 'D';

    res.json({
      totalRevenue,
      totalTime,
      avgROI,
      efficiency,
      grade,
      totalTasks: tasks.length,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});


