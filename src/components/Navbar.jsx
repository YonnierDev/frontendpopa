import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
<<<<<<< HEAD
import ChangePasswordModal from './ChangePasswordModal';
=======
import PerfilPopover from './PerfilPopover';
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571

const Navbar = ({ rol }) => {
  const navigate = useNavigate();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const storedUsuario = localStorage.getItem("usuario");
  const usuario = storedUsuario ? JSON.parse(storedUsuario) : null;
  const userName = usuario?.nombre || "Usuario";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo">POPAYÁN NOCTURNA</h1>
        </div>
        <div className="nav-right">
          <div className="user-info" onClick={() => setIsPasswordModalOpen(true)} style={{ cursor: 'pointer' }}>
            <span className="user-icon">👤</span>
            <span className="user-name">{userName}</span>
          </div>
        </div>
      </div>      
<<<<<<< HEAD
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={usuario?.correo}
      />
=======

>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
    </nav>
  );
};

export default Navbar;
