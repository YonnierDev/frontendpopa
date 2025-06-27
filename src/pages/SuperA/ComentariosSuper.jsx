import React, { useState, useEffect } from 'react';
import { FaComment, FaUser, FaCalendar, FaThumbsUp, FaThumbsDown, FaTrash, FaSearch, FaFilter, FaEye } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/ComentariosSuper.css';

const ComentariosSuper = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
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

    fetchComentarios();
  }, [currentPage]);

  const fetchComentarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://popnocturna.vercel.app/api/comentarios?page=${currentPage}&limit=${limit}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.comentarios) {
        setComentarios(response.data.comentarios || []);
        setTotalPages(response.data.totalPaginas || 1);
      } else {
        setComentarios([]);
        setError('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setComentarios([]);
      setError(error.response?.data?.mensaje || 'Error al cargar los comentarios');
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

  const filteredComentarios = Array.isArray(comentarios) ? comentarios.filter(comentario => {
    const matchesSearch = comentario?.contenido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comentario?.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || comentario?.aprobacion === filterStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  const handleView = (comentario) => {
    setSelectedComment(comentario);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://popnocturna.vercel.app/api/comentario/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Comentario eliminado correctamente');
        fetchComentarios();
      } catch (error) {
        console.error('Error al eliminar:', error);
        toast.error(error.response?.data?.mensaje || 'Error al eliminar el comentario');
      }
    }
  };

  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://popnocturna.vercel.app/api/comentario/${id}/estado`, {
        estado: nuevoEstado
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Estado del comentario actualizado');
      fetchComentarios();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast.error(error.response?.data?.mensaje || 'Error al actualizar el estado del comentario');
    }
  };

  if (loading) return <div className="comentarios-loading">Cargando comentarios...</div>;
  if (error) return <div className="comentarios-alert comentarios-alert-error">{error}</div>;

  return (
    <div className="comentarios-container">
      <div className="comentarios-header">
        <h1 className="comentarios-title">Gestión de Comentarios</h1>
        <div className="comentarios-stats">
          <div className="comentarios-stat-card">
            <div className="comentarios-stat-value">{comentarios.length}</div>
            <div className="comentarios-stat-label">Total Comentarios</div>
          </div>
          <div className="comentarios-stat-card">
            <div className="comentarios-stat-value">
              {comentarios.filter(c => c.aprobacion === 'aceptado').length}
            </div>
            <div className="comentarios-stat-label">Aprobados</div>
          </div>
          <div className="comentarios-stat-card">
            <div className="comentarios-stat-value">
              {comentarios.filter(c => c.aprobacion === 'pendiente').length}
            </div>
            <div className="comentarios-stat-label">Pendientes</div>
          </div>
        </div>
      </div>

      <div className="comentarios-filters">
        <div className="comentarios-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar comentarios..."
            value={searchTerm}
            onChange={handleSearch}
            className="comentarios-form-input"
          />
        </div>
        <div className="comentarios-filter">
          <FaFilter className="filter-icon" />
          <select value={filterStatus} onChange={handleFilter} className="comentarios-form-select">
            <option value="all">Todos los estados</option>
            <option value="aceptado">Aprobados</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="comentarios-table-container">
        <table className="comentarios-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contenido</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredComentarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="comentarios-no-data">
                  No hay comentarios disponibles
                </td>
              </tr>
            ) : (
              filteredComentarios.map(comentario => (
                <tr key={comentario.id}>
                  <td>
                    <div className="comentarios-user-info">
                      <FaUser className="user-icon" />
                      <span>{comentario.usuario?.nombre || 'Usuario no disponible'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="comentarios-content">
                      <FaComment className="comment-icon" />
                      <span>{comentario.contenido}</span>
                    </div>
                  </td>
                  <td>
                    <div className="comentarios-date-info">
                      <FaCalendar className="date-icon" />
                      <span>{new Date(comentario.fecha_hora).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`comentarios-status-badge ${comentario.aprobacion}`}>
                      {comentario.aprobacion}
                    </span>
                  </td>
                  <td>
                    <div className="comentarios-actions">
                      <button
                        className="comentarios-btn comentarios-btn-secondary"
                        onClick={() => handleView(comentario)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="comentarios-btn comentarios-btn-primary"
                        onClick={() => handleStatusChange(comentario.id, 'aceptado')}
                        title="Aprobar comentario"
                      >
                        <FaThumbsUp />
                      </button>
                      <button
                        className="comentarios-btn comentarios-btn-danger"
                        onClick={() => handleStatusChange(comentario.id, 'rechazado')}
                        title="Rechazar comentario"
                      >
                        <FaThumbsDown />
                      </button>
                      <button
                        className="comentarios-btn comentarios-btn-danger"
                        onClick={() => handleDelete(comentario.id)}
                        title="Eliminar comentario"
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

      {showModal && selectedComment && (
        <div className="comentarios-modal">
          <div className="comentarios-modal-content">
            <h2 className='title-comments'>Detalles del Comentario</h2>
            <div className="comentarios-form-group">
              <label>Usuario</label>
              <p>{selectedComment.usuario?.nombre || 'No disponible'}</p>
            </div>
            <div className="comentarios-form-group">
              <label>Evento</label>
              <p>{selectedComment.evento?.nombre || 'No disponible'}</p>
            </div>
            <div className="comentarios-form-group">
              <label>Contenido</label>
              <p className="comentarios-content-text">{selectedComment.contenido}</p>
            </div>
            <div className="comentarios-form-group">
              <label>Fecha</label>
              <p>{new Date(selectedComment.fecha_hora).toLocaleString()}</p>
            </div>
            <div className="comentarios-form-group">
              <label>Estado</label>
              <p className={`comentarios-status-badge ${selectedComment.aprobacion}`}>
                {selectedComment.aprobacion}
              </p>
            </div>
            <div className="comentarios-modal-actions">
             
              <button
                className="comentarios-btn comentarios-btn-secondary"
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

export default ComentariosSuper;
