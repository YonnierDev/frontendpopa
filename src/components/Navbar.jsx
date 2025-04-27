import React from 'react';
import { Link } from "react-router-dom";
import "./Navbar.css";
import PerfilPopover from './PerfilPopover';

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

    </nav>
  );
};

export default Navbar;
