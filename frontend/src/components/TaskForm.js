import { useState } from 'react';
import './TaskForm.css';

function TaskForm({ onCreateTask }) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [revenue, setRevenue] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask({
        title: title.trim(),
        notes: notes.trim() || null,
        revenue: parseFloat(revenue) || 0,
        timeTaken: parseFloat(timeTaken) || 0,
        priority,
        status,
      });
      // Reset form
      setTitle('');
      setNotes('');
      setRevenue('');
      setTimeTaken('');
      setPriority('Medium');
      setStatus('Pending');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            className="form-input"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Revenue ($)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Time Taken (hours)</label>
          <input
            type="number"
            step="0.1"
            className="form-input"
            placeholder="0.0"
            value={timeTaken}
            onChange={(e) => setTimeTaken(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            className="form-textarea"
            placeholder="Additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />
        </div>
      </div>

      <button type="submit" className="submit-button">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
