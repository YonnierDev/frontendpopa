import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';
import './PerfilPopover.css';

const PerfilPopover = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [show, setShow] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const popoverRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!usuario) return null;

  const getRolName = () => {
    switch(usuario.rol.toString()) {
      case '3': return 'Propietario';
      case '2': return 'Administrador';
      case '1': return 'Usuario';
      default: return usuario.rol;
    }
  };

  return (
    <div className="perfil-popover-container" ref={popoverRef}>
      <button 
        className="user-info-button" 
        onClick={() => setShow(!show)}
        aria-expanded={show}
        aria-label="Menú de perfil"
      >
        <span className="user-icon" aria-hidden="true">👤</span>
        <span className="user-name">{usuario.nombre || 'Usuario'}</span>
        <span className={`dropdown-arrow ${show ? 'open' : ''}`} aria-hidden="true">▼</span>
      </button>
      
      {show && (
        <div className="perfil-popover" role="menu">
          <div className="perfil-info">
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Rol:</strong> {getRolName()}</p>
          </div>
          
          <button 
            className="popover-action-button cambiar-contrasena-btn" 
            onClick={() => {
              setShowChangePassword(true);
              setShow(false);
            }}
            role="menuitem"
          >
            <span aria-hidden="true">🔒</span> Cambiar Contraseña
          </button>
          
          <button 
            className="popover-action-button cerrar-sesion-btn" 
            onClick={handleLogout}
            role="menuitem"
          >
            <span aria-hidden="true">🚪</span> Cerrar Sesión
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