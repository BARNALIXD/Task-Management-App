import './TaskItem.css';

function TaskItem({ task, onView, onEdit, onDelete }) {
  // BUG 4: Event bubbling issue - clicking on buttons triggers both the button and parent div
  const handleRowClick = () => {
    onView(task);
  };

  // BUG 4: Missing e.stopPropagation() on button clicks
  const handleEditClick = (e) => {
    // BUG 4: Should have e.stopPropagation() here
    onEdit(task);
  };

  const handleDeleteClick = (e) => {
    // BUG 4: Should have e.stopPropagation() here
    onDelete(task.id);
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="task-item" onClick={handleRowClick}>
      <div className="task-main">
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-badges">
            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`status-badge ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        <div className="task-metrics">
          <div className="metric">
            <span className="metric-label">Revenue</span>
            <span className="metric-value">${task.revenue.toFixed(2)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Time</span>
            <span className="metric-value">{task.timeTaken}h</span>
          </div>
          <div className="metric roi-metric">
            <span className="metric-label">ROI</span>
            <span className="metric-value roi-value">
              {isNaN(task.roi) || !isFinite(task.roi) ? '—' : task.roi.toFixed(2)}
            </span>
          </div>
        </div>

        {task.notes && (
          <p className="task-notes">{task.notes.substring(0, 100)}{task.notes.length > 100 ? '...' : ''}</p>
        )}
      </div>

      <div className="task-actions">
        <button
          className="btn-edit"
          onClick={handleEditClick}
          title="Edit"
        >
          Edit
        </button>
        <button
          className="btn-delete"
          onClick={handleDeleteClick}
          title="Delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
