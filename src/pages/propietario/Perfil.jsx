import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import Sidebar from '../../components/Sidebar';

const Perfil = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  if (!usuario) return <div>Debes iniciar sesión.</div>;

  return (
    <div className="perfil-dashboard" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="perfil-content" style={{ flex: 1, padding: '2rem' }}>
        <h2>Mi Perfil</h2>
        <div className="perfil-info" style={{ marginBottom: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: '2rem', maxWidth: 500 }}>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Rol:</strong> {usuario.rol || 'Propietario'}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            onClick={() => setShowChangePassword(true)} 
            style={{ 
              background: '#ffcc00', 
              color: '#111', 
              padding: '0.75rem 2rem', 
              border: 'none', 
              borderRadius: 6, 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🔒 Cambiar Contraseña
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              background: '#ff4d4f', 
              color: 'white', 
              padding: '0.75rem 2rem', 
              border: 'none', 
              borderRadius: 6, 
              fontWeight: 600, 
              fontSize: '1rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>
        <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} userEmail={usuario.correo} />
      </div>
    </div>
  );
};

export default Perfil;
