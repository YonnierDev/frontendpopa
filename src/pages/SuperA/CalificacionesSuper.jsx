import React, { useState, useEffect } from 'react';
import { FaStar, FaUser, FaSearch, FaFilter, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/CalificacionesSuper.css';

const CalificacionesSuper = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCalificacion, setSelectedCalificacion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario || (usuario.rol !== 1 && usuario.rol !== 2)) {
      setError('No tienes permisos para acceder a esta página');
      return;
    }

    fetchCalificaciones();
  }, [currentPage]);

  const fetchCalificaciones = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://popnocturna.vercel.app/api/calificaciones?page=${currentPage}&limit=${limit}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.datos) {
        setCalificaciones(response.data.datos.calificaciones || []);
        setTotalPages(response.data.datos.totalPaginas || 1);
      } else {
        setCalificaciones([]);
        setError('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar calificaciones:', error);
      setCalificaciones([]);
      setError(error.response?.data?.mensaje || 'Error al cargar las calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCalificaciones = Array.isArray(calificaciones) ? calificaciones.filter(calificacion =>
    calificacion?.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calificacion?.evento?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleView = (calificacion) => {
    setSelectedCalificacion(calificacion);
    setShowModal(true);
  };

  const handleEdit = async (id, puntuacion) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://popnocturna.vercel.app/api/calificacion/${id}`, {
        puntuacion
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Calificación actualizada correctamente');
      fetchCalificaciones();
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error(error.response?.data?.mensaje || 'Error al actualizar la calificación');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta calificación?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://popnocturna.vercel.app/api/calificacion/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Calificación eliminada correctamente');
        fetchCalificaciones();
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error(error.response?.data?.mensaje || 'Error al eliminar la calificación');
      }
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://popnocturna.vercel.app/api/calificacion/estado/${id}`, {
        estado: !estadoActual
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Estado de la calificación actualizado');
      fetchCalificaciones();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error(error.response?.data?.mensaje || 'Error al cambiar el estado de la calificación');
    }
  };

  const renderStars = (puntuacion) => {
    return Array(5).fill(0).map((_, index) => (
      <FaStar
        key={index}
        className={`calificaciones-star ${index < puntuacion ? 'active' : ''}`}
      />
    ));
  };

  if (loading) return <div className="calificaciones-loading">Cargando calificaciones...</div>;
  if (error) return <div className="calificaciones-alert calificaciones-alert-error">{error}</div>;

  return (
    <div className="calificaciones-container">
      <div className="calificaciones-header">
        <h1 className="calificaciones-title">Gestión de Calificaciones</h1>
        <div className="calificaciones-header-actions">
          <div className="calificaciones-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="calificaciones-form-input"
              placeholder="Buscar calificaciones..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="calificaciones-table-container">
        <table className="calificaciones-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Calificación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalificaciones.length === 0 ? (
              <tr>
                <td colSpan="5" className="calificaciones-no-data">
                  No hay calificaciones disponibles
                </td>
              </tr>
            ) : (
              filteredCalificaciones.map(calificacion => (
                <tr key={calificacion.id}>
                  <td>{calificacion.usuario?.nombre || 'Usuario no disponible'}</td>
                  <td>{calificacion.evento?.nombre || 'Evento no disponible'}</td>
                  <td>
                    <div className="calificaciones-rating">
                      {renderStars(calificacion.puntuacion)}
                      <span>({calificacion.puntuacion})</span>
                    </div>
                  </td>
                  <td>
                    <div className="calificaciones-status-column">
                      <span className={`calificaciones-status-badge ${calificacion.estado ? 'active' : 'inactive'}`}>
                        {calificacion.estado ? 'Activo' : 'Inactivo'}
                      </span>
                      <label className="calificaciones-switch">
                        <input
                          type="checkbox"
                          checked={calificacion.estado}
                          onChange={() => handleToggleEstado(calificacion.id, calificacion.estado)}
                        />
                        <span className="calificaciones-slider"></span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="calificaciones-actions">
                      <button
                        className="calificaciones-btn calificaciones-btn-secondary"
                        onClick={() => handleView(calificacion)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="calificaciones-btn calificaciones-btn-primary"
                        onClick={() => handleEdit(calificacion.id, calificacion.puntuacion)}
                        title="Editar calificación"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="calificaciones-btn calificaciones-btn-danger"
                        onClick={() => handleDelete(calificacion.id)}
                        title="Eliminar calificación"
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

      {showModal && selectedCalificacion && (
        <div className="calificaciones-modal">
          <div className="calificaciones-modal-content">
            <h2>Detalles de la Calificación</h2>
            <div className="calificaciones-form-group">
              <label>Usuario</label>
              <p>{selectedCalificacion.usuario?.nombre || 'No disponible'}</p>
            </div>
            <div className="calificaciones-form-group">
              <label>Evento</label>
              <p>{selectedCalificacion.evento?.nombre || 'No disponible'}</p>
            </div>
            <div className="calificaciones-form-group">
              <label>Calificación</label>
              <div className="calificaciones-rating">
                {renderStars(selectedCalificacion.puntuacion)}
                <span>({selectedCalificacion.puntuacion})</span>
              </div>
            </div>
            <div className="calificaciones-form-group">
              <label>Estado</label>
              <p>{selectedCalificacion.estado ? 'Activo' : 'Inactivo'}</p>
            </div>
            <div className="calificaciones-modal-actions">
              <button
                className="calificaciones-btn calificaciones-btn-secondary"
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

export default CalificacionesSuper;
