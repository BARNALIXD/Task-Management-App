import { useEffect } from 'react';
import './Snackbar.css';

function Snackbar({ message, onUndo, onClose, duration = 5000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="snackbar">
      <span className="snackbar-message">{message}</span>
      <div className="snackbar-actions">
        <button className="snackbar-btn" onClick={onUndo}>
          Undo
        </button>
        <button className="snackbar-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export default Snackbar;
