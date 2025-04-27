import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BotonSesion.css';

const BotonSesion = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/propietario/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <button className="boton-sesion" onClick={handleClick}>
      {isAuthenticated ? 'Ir al Panel de Propietario' : 'Iniciar sesión'}
    </button>
  );
};

export default BotonSesion;
