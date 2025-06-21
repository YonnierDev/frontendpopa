import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="notification-icon">
        {type === 'success' ? (
          <FaCheckCircle className="icon success" />
        ) : (
          <FaExclamationCircle className="icon error" />
        )}
      </div>
      <div className="notification-content">
        <h4>{type === 'success' ? '¡Éxito!' : 'Error'}</h4>
        <p>{message}</p>
      </div>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Notification;
