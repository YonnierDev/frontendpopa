import React, { useState, useRef, useEffect } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import './PerfilPopover.css';

const PerfilPopover = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [show, setShow] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show]);

  if (!usuario) return null;

  return (
    <div className="perfil-popover-container" ref={popoverRef}>
      <div className="user-info" onClick={() => setShow(!show)} style={{ cursor: 'pointer' }}>
        <span className="user-icon">👤</span>
        <span className="user-name">{usuario.nombre || 'Usuario'}</span>
      </div>
      {show && (
        <div className="perfil-popover">
          <div className="perfil-info">
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> {usuario.rol === 3 || usuario.rol === '3' ? 'Propietario' : usuario.rol}</p>
          </div>
          <button className="cambiar-contrasena-btn" onClick={() => setShowChangePassword(true)}>
            Cambiar Contraseña
          </button>
        </div>
      )}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        userEmail={usuario.correo}
      />
    </div>
  );
};

export default PerfilPopover;
