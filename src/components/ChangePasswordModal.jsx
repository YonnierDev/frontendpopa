import React, { useState } from 'react';
import axios from 'axios';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onClose, userEmail }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('La nueva contraseña debe tener entre 8 y 20 caracteres, incluir una mayúscula, un número y un símbolo');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch('https://popnocturna.vercel.app/api/actualizar/contrasena', 
        {
          correo: userEmail,
          contrasenaActual: currentPassword,
          nuevaContrasena: newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.mensaje) {
        setSuccess('Contraseña actualizada correctamente');
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      if (err.response) {
        console.error('Detalles del error:', err.response.data);
        setError(err.response.data.mensaje || 'Error al actualizar la contraseña. Por favor, intente nuevamente.');
      } else {
        setError('Error de conexión. Por favor, intente nuevamente.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Contraseña Actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <div className="password-requirements">
              <p>La contraseña debe tener:</p>
              <ul>
                <li>Entre 8 y 20 caracteres</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Al menos un símbolo</li>
              </ul>
            </div>
          </div>
          <div className="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal; 