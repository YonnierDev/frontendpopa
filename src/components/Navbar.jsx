import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import ChangePasswordModal from './ChangePasswordModal';

const Navbar = ({ rol }) => {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const storedUsuario = localStorage.getItem("usuario");
  const usuario = storedUsuario ? JSON.parse(storedUsuario) : null;
  const userName = usuario?.nombre || "Usuario";

  // DEBUG: Mostrar el rolid en consola
  console.log("Navbar - usuario:", usuario);
  console.log("Navbar - rol prop:", rol);
  console.log("Navbar - usuario.rolid:", usuario?.rolid);

  // Botón "Ir al panel" solo si el usuario es propietario
  const isPropietario = Number(usuario?.rolid) === 3 || Number(rol) === 3;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo">POPAYÁN NOCTURNA</h1>
        </div>
        <div className="nav-right">
          {!usuario ? (
            <button className="login-btn-navbar" onClick={() => navigate('/login')}>
              ¿Deseas iniciar sesión?
            </button>
          ) : (
            <>
              {isPropietario && !window.location.pathname.startsWith('/propietario/dashboard') && (
                <button className="panel-btn-navbar" onClick={() => navigate('/propietario/dashboard')}>
                  Ir al panel
                </button>
              )}
              {isPropietario && window.location.pathname.startsWith('/propietario/dashboard') && (
                <button className="panel-btn-navbar" onClick={() => navigate('/')}>Ir al home</button>
              )}
              <div className="user-info" style={{ position: 'relative' }} tabIndex={0} onBlur={e => {
                setTimeout(() => setShowDropdown(false), 120);
              }}>
                <span className="user-icon" onClick={() => setShowDropdown(prev => !prev)} style={{ cursor: 'pointer' }}>👤</span>
                <span className="user-name" onClick={() => setShowDropdown(prev => !prev)} style={{ cursor: 'pointer' }}>{userName}</span>
                {showDropdown && (
                  <div className="user-dropdown" tabIndex={-1}>
                    <button className="dropdown-item" onClick={() => {
                      setShowDropdown(false);
                      setIsPasswordModalOpen(true);
                    }}>Cambiar contraseña</button>
                    <button className="dropdown-item" onClick={() => {
                      setShowDropdown(false);
                      setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('usuario');
                        window.location.href = '/';
                      }, 100);
                    }}>Cerrar sesión</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>      
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={usuario?.correo}
      />
    </nav>
  );
};

export default Navbar;
