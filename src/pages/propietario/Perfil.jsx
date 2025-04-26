import React, { useState } from 'react';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import Sidebar from '../../components/Sidebar';

const Perfil = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [showChangePassword, setShowChangePassword] = useState(false);

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
        <button onClick={() => setShowChangePassword(true)} style={{ background: '#ffcc00', color: '#111', padding: '0.75rem 2rem', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
          Cambiar Contraseña
        </button>
        <ChangePasswordModal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} userEmail={usuario.correo} />
      </div>
    </div>
  );
};

export default Perfil;
