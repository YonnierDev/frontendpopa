import React from "react";
import "./GuestModal.css";

const GuestModal = ({ open, onClose, onLogin }) => {
  if (!open) return null;
  return (
    <div className="guest-modal-overlay">
      <div className="guest-modal-content">
        <h2>¡Atención!</h2>
        <p>
          Para seguir explorando y disfrutar de todas las funciones de nuestra página,
          primero debes iniciar sesión con tu cuenta.
        </p>
        <button className="guest-modal-login-btn" onClick={onLogin}>
          Iniciar sesión
        </button>
        <button className="guest-modal-close-btn" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default GuestModal;
