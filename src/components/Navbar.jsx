import React from 'react';
import { Link } from "react-router-dom";
import "./Navbar.css";
import PerfilPopover from './PerfilPopover';
import logo from '../pages/camilo.png';

const Navbar = ({ rol }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo-container">
            <img 
              src={logo} 
              alt="Logo" 
              className="navbar-logo" 
              style={{
                height: '60px',
                width: 'auto',
                maxHeight: 'none',
                objectFit: 'contain',
                marginRight: '15px',
                marginTop: '-5px'
              }}
            />
            <h1 className="logo">POPAYÁN NOCTURNA</h1>
          </Link>
        </div>
        <div className="nav-right">
          <PerfilPopover />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
