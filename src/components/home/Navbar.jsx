import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserCircle, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import logo from '../../assets/logos.png'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <nav className="navbar navbar-expand-lg  shadow-sm p-1 mb-2">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="logo-navbar me-2" />
          
        </Link>

        <div className="position-relative">
          <FaUserCircle
            size={30}
            className="user-icon"
            onClick={toggleMenu}
            title="Cuenta"
          />
          {showMenu && (
            <div
              className="dropdown-menu show shadow p-3"
              style={{ right: 0, position: 'absolute', top: '40px' }}
            >
              <Link to="/" className="dropdown-item d-flex align-items-center">
                <FaHome className="me-2" /> Inicio
              </Link>
              <Link to="/login" className="dropdown-item d-flex align-items-center">
                <FaSignInAlt className="me-2" /> Iniciar sesión
              </Link>
              <Link to="/register" className="dropdown-item d-flex align-items-center">
                <FaUserPlus className="me-2" /> Regístrate
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
