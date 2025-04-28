import React, { useState, useEffect } from 'react';
import { FaCalendar, FaEdit, FaTrash, FaSearch, FaFilter, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/ReservasSuper.css';

const ReservasSuper = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario || (usuario.rol !== 1 && usuario.rol !== 2)) {
      setError('No tienes permisos para acceder a esta página');
      return;
    }

    fetchReservas();
  }, [filterStatus, fechaDesde, fechaHasta]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://popnocturna.vercel.app/api/reservas`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('API Response (reservas):', response.data);
      if (Array.isArray(response.data)) {
        setReservas(response.data);
      } else if (response.data && Array.isArray(response.data.datos?.rows)) {
        setReservas(response.data.datos.rows);
      } else {
        setReservas([]);
        setError('No hay reservas disponibles o formato inesperado.');
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error, error.response);
      setReservas([]);
      setError(error.response?.data?.mensaje || 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleAprobarReserva = async (numeroReserva, aprobacion) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://popnocturna.vercel.app/api/reserva/aprobar/${numeroReserva}`,
        { aprobacion },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Estado de la reserva actualizado correctamente');
      fetchReservas();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error(error.response?.data?.mensaje || 'Error al actualizar el estado de la reserva');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://popnocturna.vercel.app/api/reserva/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Reserva eliminada correctamente');
        fetchReservas();
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error(error.response?.data?.mensaje || 'Error al eliminar la reserva');
      }
    }
  };

  const handleView = (reserva) => {
    setSelectedReserva(reserva);
    setShowModal(true);
  };

  // Filtro local por estado y búsqueda
  const filteredReservas = Array.isArray(reservas)
    ? reservas.filter(reserva => {
        const matchesStatus = filterStatus === 'all' || (reserva.aprobacion && reserva.aprobacion.toLowerCase() === filterStatus);
        const matchesSearch =
          reserva.numero_reserva?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reserva.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reserva.evento?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        let matchesDate = true;
        if (fechaDesde) matchesDate = matchesDate && new Date(reserva.fecha_hora) >= new Date(fechaDesde);
        if (fechaHasta) matchesDate = matchesDate && new Date(reserva.fecha_hora) <= new Date(fechaHasta);
        return matchesStatus && matchesSearch && matchesDate;
      })
    : [];

  return (
    <div className="reservas-container">
      <div className="reservas-header">
        <h1 className="reservas-title">Gestión de Reservas</h1>
        <div className="reservas-stats">
          <div className="reservas-stat-card">
            <div className="reservas-stat-value">{Array.isArray(reservas) ? reservas.length : 0}</div>
            <div className="reservas-stat-label">Total Reservas</div>
          </div>
          <div className="reservas-stat-card">
            <div className="reservas-stat-value">
              {Array.isArray(reservas) ? reservas.filter(r => r.aprobacion === 'aceptado').length : 0}
            </div>
            <div className="reservas-stat-label">Aprobadas</div>
          </div>
          <div className="reservas-stat-card">
            <div className="reservas-stat-value">
              {Array.isArray(reservas) ? reservas.filter(r => r.aprobacion === 'pendiente' || r.aprobacion === 'Pendiente').length : 0}
            </div>
            <div className="reservas-stat-label">Pendientes</div>
          </div>
        </div>
      </div>

      <div className="reservas-filters">
        <div className="reservas-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={handleSearch}
            className="reservas-form-input"
          />
        </div>
        <div className="reservas-filter">
          <FaFilter className="filter-icon" />
          <select value={filterStatus} onChange={handleFilter} className="reservas-form-select">
            <option value="all">Todos los estados</option>
            <option value="aceptado">Aprobadas</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazadas</option>
          </select>
        </div>
        <div className="reservas-date-filters">
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="reservas-form-input"
            placeholder="Fecha desde"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="reservas-form-input"
            placeholder="Fecha hasta"
          />
        </div>
      </div>

      <div className="reservas-table-container">
        <table className="reservas-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="reservas-no-data">Cargando reservas...</td></tr>
            ) : error ? (
              <tr><td colSpan="6" className="reservas-no-data">{error}</td></tr>
            ) : filteredReservas.length === 0 ? (
              <tr>
                <td colSpan="6" className="reservas-no-data">
                  No hay reservas disponibles
                </td>
              </tr>
            ) : (
              filteredReservas.map(reserva => (
                <tr key={reserva.id}>
                  <td>{reserva.numero_reserva}</td>
                  <td>
                    <div className="reservas-user-info">
                      <span>{reserva.usuario?.nombre || 'Usuario no disponible'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="reservas-event-info">
                      <span>{reserva.evento?.nombre || 'Evento no disponible'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="reservas-date-info">
                      <FaCalendar className="date-icon" />
                      <span>{new Date(reserva.fecha_hora).toLocaleString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`reservas-status-badge ${reserva.aprobacion?.toLowerCase()}`}>
                      {reserva.aprobacion}
                    </span>
                  </td>
                  <td>
                    <div className="reservas-actions">
                      <button
                        className="reservas-btn reservas-btn-secondary"
                        onClick={() => handleView(reserva)}
                        title="Ver detalles"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="reservas-btn reservas-btn-primary"
                        onClick={() => handleAprobarReserva(reserva.numero_reserva, 'aceptado')}
                        title="Aprobar reserva"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="reservas-btn reservas-btn-danger"
                        onClick={() => handleAprobarReserva(reserva.numero_reserva, 'rechazado')}
                        title="Rechazar reserva"
                      >
                        <FaTimes />
                      </button>
                      <button
                        className="reservas-btn reservas-btn-danger"
                        onClick={() => handleDelete(reserva.id)}
                        title="Eliminar reserva"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedReserva && (
        <div className="reservas-modal">
          <div className="reservas-modal-content">
            <h2>Detalles de la Reserva</h2>
            <div className="reservas-form-group">
              <label>Número de Reserva</label>
              <p>{selectedReserva.numero_reserva}</p>
            </div>
            <div className="reservas-form-group">
              <label>Usuario</label>
              <p>{selectedReserva.usuario?.nombre}</p>
            </div>
            <div className="reservas-form-group">
              <label>Evento</label>
              <p>{selectedReserva.evento?.nombre}</p>
            </div>
            <div className="reservas-form-group">
              <label>Fecha</label>
              <p>{new Date(selectedReserva.fecha_hora).toLocaleString()}</p>
            </div>
            <div className="reservas-form-group">
              <label>Estado</label>
              <p>{selectedReserva.aprobacion}</p>
            </div>
            <div className="reservas-modal-actions">
              <button
                className="reservas-btn reservas-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasSuper;
