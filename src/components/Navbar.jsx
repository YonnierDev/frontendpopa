import React from 'react';
import { Link } from "react-router-dom";
import "./Navbar.css";
import PerfilPopover from './PerfilPopover';

const Navbar = ({ rol }) => {

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <h1 className="logo">POPAYÁN NOCTURNA</h1>
        </div>
        <div className="nav-right">
          <PerfilPopover />
        </div>
      </div>      

    </nav>
  );
};

export default Navbar;
