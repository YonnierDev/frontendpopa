import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Panel de Control - Popayán Nocturna</h1>
          <button className="logout-btn" onClick={() => navigate('/login')}>
            Cerrar sesión
          </button>
        </div>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Bienvenido al Panel Administrativo</h2>
            <p>Selecciona una sección para administrar</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card" onClick={() => navigate('/categorias')}>
              <div className="card-icon">📝</div>
              <h3>Categorías</h3>
              <p>Gestiona las categorías de lugares</p>
              <div className="card-footer">
                <button className="card-btn">Administrar</button>
              </div>
            </div>

            <div className="dashboard-card" onClick={() => navigate('/lugares')}>
              <div className="card-icon">📍</div>
              <h3>Lugares</h3>
              <p>Administra los lugares registrados</p>
              <div className="card-footer">
                <button className="card-btn">Administrar</button>
              </div>
            </div>

            <div className="dashboard-card" onClick={() => navigate('/comentarios')}>
              <div className="card-icon">💬</div>
              <h3>Comentarios</h3>
              <p>Gestiona los comentarios de usuarios</p>
              <div className="card-footer">
                <button className="card-btn">Administrar</button>
              </div>
            </div>

            <div className="dashboard-card" onClick={() => navigate('/calificaciones')}>
              <div className="card-icon">⭐</div>
              <h3>Calificaciones</h3>
              <p>Revisa las calificaciones de lugares</p>
              <div className="card-footer">
                <button className="card-btn">Administrar</button>
              </div>
            </div>

            <div className="dashboard-card" onClick={() => navigate('/eventos')}>
              <div className="card-icon">🎉</div>
              <h3>Eventos</h3>
              <p>Gestiona los eventos programados</p>
              <div className="card-footer">
                <button className="card-btn">Administrar</button>
              </div>
            </div>

            <div className="dashboard-card" onClick={() => navigate('/reservas')}>
              <div className="card-icon">📅</div>
              <h3>Reservas</h3>
              <p>Administra las reservas de eventos</p>
              <div className="card-footer">
                <button className="card-btn">Administrar</button>
              </div>
            </div>

            <div className="dashboard-card stats">
              <div className="stat-item">
                <h4>Total Lugares</h4>
                <span className="stat-number">24</span>
              </div>
              <div className="stat-item">
                <h4>Eventos Activos</h4>
                <span className="stat-number">12</span>
              </div>
              <div className="stat-item">
                <h4>Reservas Pendientes</h4>
                <span className="stat-number">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
