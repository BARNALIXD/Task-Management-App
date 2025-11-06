import { useState } from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  const [viewingTask, setViewingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  const handleView = (task) => {
    setViewingTask(task);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleDelete = (taskId) => {
    setDeletingTaskId(taskId);
  };

  const confirmDelete = () => {
    if (deletingTaskId) {
      onDeleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  const handleSave = async (id, updates) => {
    await onUpdateTask(id, updates);
    setEditingTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-stats">
        <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="tasks-container">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* View Dialog */}
      {viewingTask && (
        <div className="dialog-overlay" onClick={() => setViewingTask(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Task Details</h2>
              <button className="close-btn" onClick={() => setViewingTask(null)}>×</button>
            </div>
            <div className="dialog-content">
              <div className="detail-row">
                <strong>Title:</strong>
                <span>{viewingTask.title}</span>
              </div>
              <div className="detail-row">
                <strong>Revenue:</strong>
                <span>${viewingTask.revenue.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <strong>Time Taken:</strong>
                <span>{viewingTask.timeTaken}h</span>
              </div>
              <div className="detail-row">
                <strong>ROI:</strong>
                <span>{viewingTask.roi.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <strong>Priority:</strong>
                <span className={`priority-badge ${viewingTask.priority.toLowerCase()}`}>
                  {viewingTask.priority}
                </span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <span className={`status-badge ${viewingTask.status.toLowerCase().replace(' ', '-')}`}>
                  {viewingTask.status}
                </span>
              </div>
              {viewingTask.notes && (
                <div className="detail-row">
                  <strong>Notes:</strong>
                  <p>{viewingTask.notes}</p>
                </div>
              )}
              <div className="detail-row">
                <strong>Created:</strong>
                <span>{new Date(viewingTask.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editingTask && (
        <div className="dialog-overlay" onClick={() => setEditingTask(null)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Edit Task</h2>
              <button className="close-btn" onClick={() => setEditingTask(null)}>×</button>
            </div>
            <div className="dialog-content">
              <EditForm
                task={editingTask}
                onSave={handleSave}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTaskId && (
        <div className="dialog-overlay" onClick={() => setDeletingTaskId(null)}>
          <div className="dialog dialog-small" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setDeletingTaskId(null)}>×</button>
            </div>
            <div className="dialog-content">
              <p>Are you sure you want to delete this task?</p>
              <div className="dialog-actions">
                <button className="btn-danger" onClick={confirmDelete}>
                  Delete
                </button>
                <button className="btn-secondary" onClick={() => setDeletingTaskId(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditForm({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [revenue, setRevenue] = useState(task.revenue);
  const [timeTaken, setTimeTaken] = useState(task.timeTaken);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(task.id, {
        title: title.trim(),
        notes: notes.trim() || null,
        revenue: parseFloat(revenue) || 0,
        timeTaken: parseFloat(timeTaken) || 0,
        priority,
        status,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          className="form-input"
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
      <div className="form-group">
        <label>Notes</label>
        <textarea
          className="form-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
        />
      </div>
      <div className="dialog-actions">
        <button type="submit" className="btn-primary">
          Save Changes
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskList;
