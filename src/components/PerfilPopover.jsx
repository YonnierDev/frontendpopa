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
          <button 
            className="cambiar-contrasena-btn" 
            onClick={() => setShowChangePassword(true)}
            style={{
              background: '#2d2d2d',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 0',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '1rem',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.target.style.background = '#3d3d3d'}
            onMouseOut={(e) => e.target.style.background = '#2d2d2d'}
          >
            <span>🔒</span> Cambiar Contraseña
          </button>
          <button 
            className="cerrar-sesion-btn" 
            onClick={handleLogout}
            style={{
              background: '#000',
              color: '#fff',
              border: 'none',
              padding: '0.65rem 0',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              marginTop: '0.75rem',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.9'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            <span>🚪</span> Cerrar Sesión
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
