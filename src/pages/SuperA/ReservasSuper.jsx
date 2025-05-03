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
        setError('No tienes permisos para acceder a esta página.');
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
      toast.error(error.response?.data?.mensaje || 'Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobarReserva = async (numero_reserva, aprobacion) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://popnocturna.vercel.app/api/reserva/aprobar/${numero_reserva}`,
        { aprobacion },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('Estado de reserva actualizado correctamente');
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
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        
        if (!token || !usuario) {
          toast.error('No hay sesión activa');
          return;
        }

        // Verificar si el usuario tiene permisos (rol 1 o 2)
        if (![1, 2].includes(usuario.rol)) {
          toast.error('No tienes permisos para eliminar reservas');
          return;
        }

        // Primero verificar si la reserva existe
        const checkResponse = await axios.get(
          `https://popnocturna.vercel.app/api/reserva/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!checkResponse.data) {
          toast.error('La reserva no existe');
          return;
        }

        // Si la reserva existe, proceder con la eliminación
        const response = await axios({
          method: 'delete',
          url: `https://popnocturna.vercel.app/api/reserva/${id}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.mensaje) {
          toast.success(response.data.mensaje);
          // Actualizar la lista de reservas
          fetchReservas();
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        if (error.response) {
          // El servidor respondió con un código de error
          const errorMessage = error.response.data?.mensaje || 'Error al eliminar la reserva';
          toast.error(errorMessage);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          toast.error('No se recibió respuesta del servidor');
        } else {
          // Error al configurar la petición
          toast.error('Error al procesar la solicitud');
        }
      }
    }
  };

  const handleView = async (numero_reserva) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://popnocturna.vercel.app/api/reserva/${numero_reserva}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setSelectedReserva(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      toast.error(error.response?.data?.mensaje || 'Error al cargar los detalles de la reserva');
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

  if (loading) return <div className="super-loading">Cargando...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="super-reservas-layout">
      <div className="super-reservas-header">
        <h1 className="super-reservas-title">Gestión de Reservas</h1>
        <div className="super-reservas-filters">
          <input
            type="text"
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="super-reservas-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="super-reservas-select"
          >
            <option value="all">Todos los estados</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="super-reservas-date"
            placeholder="Fecha desde"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="super-reservas-date"
            placeholder="Fecha hasta"
          />
        </div>
      </div>

      <div className="super-reservas-table-container" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
        overflow: 'auto'
      }}>
        <table className="super-reservas-table" style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Número Reserva</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Usuario</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Evento</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Fecha</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Aprobación</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#333' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No hay reservas disponibles
                </td>
              </tr>
            ) : (
              reservas.map(reserva => (
                <tr key={reserva.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px', color: '#333' }}>{reserva.numero_reserva}</td>
                  <td style={{ padding: '12px', color: '#333' }}>{reserva.usuario?.nombre || 'Usuario no disponible'}</td>
                  <td style={{ padding: '12px', color: '#333' }}>{reserva.evento?.nombre || 'Evento no disponible'}</td>
                  <td style={{ padding: '12px', color: '#333' }}>{formatDate(reserva.fecha_hora)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      backgroundColor: reserva.estado ? '#4CAF50' : '#f44336',
                      color: 'white'
                    }}>
                      {reserva.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      backgroundColor: reserva.aprobacion === 'aceptado' ? '#4CAF50' : 
                                     reserva.aprobacion === 'rechazado' ? '#f44336' : '#FFA500',
                      color: 'white'
                    }}>
                      {reserva.aprobacion || 'Pendiente'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div className="super-reservas-actions" style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="super-reservas-btn view" 
                        onClick={() => handleView(reserva.numero_reserva)}
                        title="Ver detalles"
                        style={{
                          padding: '6px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaEye />
                      </button>
                      {[1, 2].includes(JSON.parse(localStorage.getItem('usuario'))?.rol) && (
                        <button 
                          className="super-reservas-btn delete" 
                          onClick={() => handleDelete(reserva.id)}
                          title="Eliminar reserva"
                          style={{
                            padding: '6px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <FaTrash />
                        </button>
                      )}
                      {[1, 2, 3].includes(JSON.parse(localStorage.getItem('usuario'))?.rol) && (
                        <>
                          <button 
                            className="super-reservas-btn approve" 
                            onClick={() => handleAprobarReserva(reserva.numero_reserva, 'aceptado')}
                            title="Aprobar reserva"
                            style={{
                              padding: '6px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <FaCheck />
                          </button>
                          <button 
                            className="super-reservas-btn reject" 
                            onClick={() => handleAprobarReserva(reserva.numero_reserva, 'rechazado')}
                            title="Rechazar reserva"
                            style={{
                              padding: '6px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedReserva && (
        <div className="super-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="super-modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '600px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>Detalles de la Reserva</h2>
            <div className="reserva-details" style={{ marginBottom: '20px' }}>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Número de Reserva:</strong> {selectedReserva.numero_reserva}
              </p>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Usuario:</strong> {selectedReserva.usuario?.nombre}
              </p>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Correo:</strong> {selectedReserva.usuario?.correo}
              </p>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Evento:</strong> {selectedReserva.evento?.nombre}
              </p>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Fecha del Evento:</strong> {formatDate(selectedReserva.evento?.fecha_hora)}
              </p>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Estado:</strong> 
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  backgroundColor: selectedReserva.estado ? '#4CAF50' : '#f44336',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  {selectedReserva.estado ? 'Activo' : 'Inactivo'}
                </span>
              </p>
              <p style={{ margin: '10px 0', color: '#333' }}>
                <strong style={{ color: '#666' }}>Aprobación:</strong>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  backgroundColor: selectedReserva.aprobacion === 'aceptado' ? '#4CAF50' : 
                                 selectedReserva.aprobacion === 'rechazado' ? '#f44336' : '#FFA500',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  {selectedReserva.aprobacion || 'Pendiente'}
                </span>
              </p>
            </div>
            <button 
              className="super-btn super-btn-secondary"
              onClick={() => setShowModal(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasSuper;
