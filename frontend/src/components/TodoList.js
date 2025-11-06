import React, { useState } from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

function TodoList({ todos, onToggleComplete, onUpdateTodo, onDeleteTodo }) {
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (id, updates) => {
    await onUpdateTodo(id, updates);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      <div className="todo-stats">
        <span>
          {completedCount} of {totalCount} completed
        </span>
      </div>
      <div className="todos-container">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onToggleComplete={onToggleComplete}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={onDeleteTodo}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoList;

