import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import { useNavigate } from 'react-router-dom';
import './DashboardPropietario.css';
import Sidebar from '../../components/Sidebar';

const DashboardPropietario = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLugares: 0,
    eventosActivos: 0,
    reservasPendientes: 0
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const lugaresResponse = await api.get("/lugares");
      const totalLugares = lugaresResponse.data.length;

      const eventosResponse = await api.get("/eventos");
      const eventosActivos = eventosResponse.data.filter(evento => evento.estado === true).length;

      const reservasResponse = await api.get("/reservas");
      const reservasPendientes = reservasResponse.data.filter(reserva => reserva.estado === true).length;

      setStats({
        totalLugares,
        eventosActivos,
        reservasPendientes
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

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
                <span className="stat-number">{stats.totalLugares}</span>
              </div>
              <div className="stat-item">
                <h4>Eventos Activos</h4>
                <span className="stat-number">{stats.eventosActivos}</span>
              </div>
              <div className="stat-item">
                <h4>Reservas Pendientes</h4>
                <span className="stat-number">{stats.reservasPendientes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPropietario;
