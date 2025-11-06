import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Snackbar from './components/Snackbar';
import SummaryInsights from './components/SummaryInsights';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const [lastDeletedTask, setLastDeletedTask] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ensure fetch runs only once even under React 18 StrictMode (dev double-invoke)
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchTasks();
  }, []);

  // Create new task
  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
    }
  };

  // Update task
  const handleUpdateTask = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(tasks.filter(task => task.id !== id));

      // Set last deleted task for undo feature
      setLastDeletedTask(taskToDelete);
      setShowSnackbar(true);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    }
  };

  // Undo delete
  const handleUndoDelete = async () => {
    if (lastDeletedTask) {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lastDeletedTask),
        });
        if (!response.ok) {
          throw new Error('Failed to restore task');
        }
        const restoredTask = await response.json();
        setTasks([restoredTask, ...tasks]);
        setShowSnackbar(false);
        setLastDeletedTask(null);
      } catch (err) {
        setError(err.message);
        console.error('Error restoring task:', err);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setLastDeletedTask(null);
  };

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      // Primary sort: ROI (descending)
      if (b.roi !== a.roi) {
        return b.roi - a.roi;
      }

      // Secondary sort: Priority
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Tertiary sort: createdAt (newer first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = getSortedTasks();

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'All') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    return filtered;
  };

  // CSV Export
  const handleExportCSV = () => {
    const csvHeaders = ['Title', 'Notes', 'Revenue', 'Time Taken', 'ROI', 'Priority', 'Status', 'Created At'];
    const csvRows = tasks.map(task => [
      task.title,
      task.notes || '',
      task.revenue,
      task.timeTaken,
      task.roi,
      task.priority,
      task.status,
      new Date(task.createdAt).toLocaleString()
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImportCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n').slice(1); // Skip header

      for (const row of rows) {
        if (!row.trim()) continue;

        const values = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const cleanValues = values.map(v => v.replace(/^"|"$/g, ''));

        if (cleanValues.length >= 7) {
          const taskData = {
            title: cleanValues[0],
            notes: cleanValues[1] || null,
            revenue: parseFloat(cleanValues[2]) || 0,
            timeTaken: parseFloat(cleanValues[3]) || 0,
            priority: cleanValues[5] || 'Medium',
            status: cleanValues[6] || 'Pending',
          };

          await handleCreateTask(taskData);
        }
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Task Management App</h1>
          <p>Track and prioritize tasks by ROI for maximum efficiency</p>
        </header>

        <SummaryInsights />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button className="btn-secondary" onClick={handleExportCSV}>
            Export CSV
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <TaskForm onCreateTask={handleCreateTask} />

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {showSnackbar && (
          <Snackbar
            message="Task deleted"
            onUndo={handleUndoDelete}
            onClose={handleCloseSnackbar}
          />
        )}
      </div>
    </div>
  );
}

export default App;

