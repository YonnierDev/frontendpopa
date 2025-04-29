import React, { useState, useEffect } from 'react';
import { FaCalendar, FaEdit, FaTrash, FaSearch, FaFilter, FaCheck, FaTimes, FaSort, FaSortUp, FaSortDown, FaUser, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/ReservasSuper.css';
import './styles/SuperReservas.css';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha_hora', direction: 'desc' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario || ![1, 2, 3, 8].includes(usuario.rol)) {
      setError('No tienes permisos para acceder a esta página. Solo SuperAdmin, Administrador, Propietario y Usuario pueden acceder.');
      setLoading(false);
      return;
    }

    fetchReservas();
  }, [filterStatus, fechaDesde, fechaHasta, currentPage, searchTerm]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      if (!token || !usuario || ![1, 2, 3, 8].includes(usuario.rol)) {
        setError('No tienes permisos para acceder a esta página. Solo SuperAdmin, Administrador, Propietario y Usuario pueden acceder.');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { estado: filterStatus }),
        ...(fechaDesde && { fechaDesde }),
        ...(fechaHasta && { fechaHasta })
      });

      const response = await axios.get(
        `https://popnocturna.vercel.app/api/reservas?${params.toString()}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.datos) {
        const reservasData = Array.isArray(response.data.datos) 
          ? response.data.datos 
          : response.data.datos.rows || [];
        
        setReservas(reservasData);
        setTotalPages(Math.ceil((response.data.datos.count || reservasData.length) / itemsPerPage));
      } else {
        setReservas([]);
        setError('No hay reservas disponibles');
      }
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      setReservas([]);
      setError(error.response?.data?.mensaje || 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const sortedReservas = Array.isArray(reservas) ? [...reservas].sort((a, b) => {
    if (sortConfig.key === 'fecha_hora') {
      return sortConfig.direction === 'asc'
        ? new Date(a.fecha_hora) - new Date(b.fecha_hora)
        : new Date(b.fecha_hora) - new Date(a.fecha_hora);
    }
    if (sortConfig.key.includes('.')) {
      const [parent, child] = sortConfig.key.split('.');
      if (a[parent] && b[parent]) {
        return sortConfig.direction === 'asc'
          ? (a[parent][child] || '').localeCompare(b[parent][child] || '')
          : (b[parent][child] || '').localeCompare(a[parent][child] || '');
      }
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  }) : [];

  const handleAprobarReserva = async (numero_reserva, aprobacion) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/reserva/aprobar/${numero_reserva}`, { aprobacion }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualiza la lista
      fetchReservas();
    } catch (error) {
      alert('Error al actualizar el estado de la reserva');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reserva?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/reserva/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Actualiza la lista
        setReservas(prev => prev.filter(r => r.id !== id));
      } catch (error) {
        alert('Error al eliminar la reserva');
      }
    }
  };

  const handleView = async (numero_reserva) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/reserva/${numero_reserva}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedReserva(res.data);
      setShowModal(true);
    } catch (error) {
      alert('Error al cargar los detalles de la reserva');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="super-reservas-layout">
      <div className="super-reservas-header">
        <h1 className="super-reservas-title">Gestión de Reservas</h1>
        <div className="super-reservas-filters">
          <input
            type="text"
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={handleSearch}
            className="super-reservas-input"
          />
          {/* Puedes agregar más filtros aquí si lo deseas */}
        </div>
      </div>
      <div className="super-reservas-table-container">
        <table className="super-reservas-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="5" className="super-reservas-no-data">
                  No hay reservas disponibles
                </td>
              </tr>
            ) : (
              reservas.map(reserva => (
                <tr key={reserva.id} className="super-reservas-row">
                  <td>{reserva.usuario?.nombre || 'Usuario no disponible'}</td>
                  <td>{reserva.evento?.nombre || 'Evento no disponible'}</td>
                  <td>{formatDate(reserva.fecha_hora)}</td>
                  <td>{reserva.aprobacion}</td>
                  <td>
                    <div className="super-reservas-actions">
                      <button className="super-reservas-btn view" onClick={() => handleView(reserva.numero_reserva)}>Ver</button>
                      <button className="super-reservas-btn delete" onClick={() => handleDelete(reserva.id)}>Eliminar</button>
                      <button className="super-reservas-btn view" onClick={() => handleAprobarReserva(reserva.numero_reserva, 'aceptado')}>Aprobar</button>
                      <button className="super-reservas-btn delete" onClick={() => handleAprobarReserva(reserva.numero_reserva, 'rechazado')}>Rechazar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservasSuper;
