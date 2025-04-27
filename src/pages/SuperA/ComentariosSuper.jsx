import React, { useState, useEffect } from 'react';
import { FaComment, FaUser, FaCalendar, FaThumbsUp, FaThumbsDown, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import './styles/ComentariosSuper.css';

const ComentariosSuper = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    fetchComentarios();
  }, []);

  const fetchComentarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/comentarios');
      setComentarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los comentarios');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredComentarios = comentarios.filter(comentario => {
    const matchesSearch = comentario.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comentario.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || comentario.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
      try {
        await axios.delete(`http://localhost:3001/api/comentarios/${id}`);
        fetchComentarios();
      } catch (err) {
        setError('Error al eliminar el comentario');
      }
    }
  };

  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      await axios.patch(`http://localhost:3001/api/comentarios/${id}`, {
        estado: nuevoEstado
      });
      fetchComentarios();
    } catch (err) {
      setError('Error al actualizar el estado del comentario');
    }
  };

  if (loading) return <div className="super-loading">Cargando...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="super-container">
      <div className="super-header">
        <h1 className="super-title">Gestión de Comentarios</h1>
        <div className="super-stats">
          <div className="super-stat-card">
            <div className="super-stat-value">{comentarios.length}</div>
            <div className="super-stat-label">Total Comentarios</div>
          </div>
          <div className="super-stat-card">
            <div className="super-stat-value">
              {comentarios.filter(c => c.estado === 'aprobado').length}
            </div>
            <div className="super-stat-label">Aprobados</div>
          </div>
          <div className="super-stat-card">
            <div className="super-stat-value">
              {comentarios.filter(c => c.estado === 'pendiente').length}
            </div>
            <div className="super-stat-label">Pendientes</div>
          </div>
        </div>
      </div>

      <div className="super-filters">
        <div className="super-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar comentarios..."
            value={searchTerm}
            onChange={handleSearch}
            className="super-form-input"
          />
        </div>
        <div className="super-filter">
          <FaFilter className="filter-icon" />
          <select value={filterStatus} onChange={handleFilter} className="super-form-select">
            <option value="all">Todos los estados</option>
            <option value="aprobado">Aprobados</option>
            <option value="pendiente">Pendientes</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="super-table-container">
        <table className="super-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contenido</th>
              <th>Fecha</th>
              <th>Likes</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredComentarios.map(comentario => (
              <tr key={comentario.id}>
                <td>
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>{comentario.usuario.nombre}</span>
                  </div>
                </td>
                <td>
                  <div className="comment-content">
                    <FaComment className="comment-icon" />
                    <span>{comentario.contenido}</span>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <FaCalendar className="date-icon" />
                    <span>{new Date(comentario.fecha).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <div className="likes-info">
                    <FaThumbsUp className="like-icon" />
                    <span>{comentario.likes}</span>
                    <FaThumbsDown className="dislike-icon" />
                    <span>{comentario.dislikes}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${comentario.estado}`}>
                    {comentario.estado}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="super-btn super-btn-icon"
                      onClick={() => handleStatusChange(comentario.id, 'aprobado')}
                    >
                      <FaThumbsUp />
                    </button>
                    <button 
                      className="super-btn super-btn-icon super-btn-danger"
                      onClick={() => handleStatusChange(comentario.id, 'rechazado')}
                    >
                      <FaThumbsDown />
                    </button>
                    <button 
                      className="super-btn super-btn-icon super-btn-danger"
                      onClick={() => handleDelete(comentario.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComentariosSuper;
