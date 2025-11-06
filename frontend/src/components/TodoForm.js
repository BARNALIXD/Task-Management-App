import React, { useState } from 'react';
import './TodoForm.css';

function TodoForm({ onCreateTodo }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTodo({
        title: title.trim(),
        description: description.trim() || null,
      });
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          className="form-textarea"
          placeholder="Enter description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      <button type="submit" className="submit-button">
        Add Task
      </button>
    </form>
  );
}

export default TodoForm;


