import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './DashboardPropietario.css';
import Dashboard from './Dashboard';
import Lugares from './Lugares';
import Eventos from './Eventos';
import Reservas from './Reservas';
import Comentarios from './Comentarios';
import Calificaciones from './Calificaciones';

const DashboardPropietario = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario || !usuario.token) {
    navigate('/login');
    return null;
  }

  const menuItems = [
    { path: '/propietario/dashboard', icon: '🏠', text: 'Inicio' },
    { path: '/propietario/lugares', icon: '📍', text: 'Lugares' },
    { path: '/propietario/eventos', icon: '🎉', text: 'Eventos' },
    { path: '/propietario/reservas', icon: '📅', text: 'Reservas' },
    { path: '/propietario/comentarios', icon: '💬', text: 'Comentarios' },
    { path: '/propietario/calificaciones', icon: '⭐', text: 'Calificaciones' }
  ];

  return (
    <div className="dashboard-container">
      <Sidebar menuItems={menuItems} />
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lugares" element={<Lugares />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/comentarios" element={<Comentarios />} />
          <Route path="/calificaciones" element={<Calificaciones />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardPropietario;
