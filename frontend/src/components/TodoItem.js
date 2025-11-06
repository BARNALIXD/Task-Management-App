import React, { useEffect, useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, isEditing, onToggleComplete, onEdit, onSave, onCancel, onDelete }) {
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  useEffect(() => {
    if (isEditing) {
      setEditTitle(todo.title);
      setEditDescription(todo.description || '');
    }
  }, [isEditing, todo]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onSave(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="todo-item editing">
        <div className="edit-form">
          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <textarea
            className="edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Description (optional)"
            rows="3"
          />
          <div className="edit-actions">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id, todo.completed)}
        />
        <div className="todo-text">
          <h3 className="todo-title">{todo.title}</h3>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          <span className="todo-date">
            Created: {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(todo.id)}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TodoItem;



