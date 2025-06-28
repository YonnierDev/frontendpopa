import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/ReportCometPageSuper.css';
import { api } from '../../components/api/api';

const ReportCometPageSuper = () => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const response = await api.get('/administracion/comentarios/reportados');
        setComentarios(response.data.datos);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error al cargar los comentarios');
      } finally {
        setLoading(false);
      }
    };

    fetchComentarios();
  }, []);

  const handleAprobar = async (id) => {
    try {
      await axios.put(`/administracion/comentarios/${id}/aprobar`);
      setComentarios(comentarios.filter(com => com.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al aprobar el comentario');
    }
  };

  const handleRechazar = async (id) => {
    try {
      await axios.put(`/administracion/comentarios/${id}/rechazar`);
      setComentarios(comentarios.filter(com => com.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al rechazar el comentario');
    }
  };

  if (loading) {
    return (
      <div className="container  loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando comentarios reportados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container  error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container  report-container">
      <h1 className="report-title">
        Reporte de Comentarios
      </h1>
      
      {comentarios.length === 0 ? (
        <div className="alert alert-info">
          No hay comentarios reportados pendientes de revisión.
        </div>
      ) : (
        <div className="tables">
          <table className="report-table">
            <thead className="table-tables">
              <tr>
                {/* <th>ID</th> */}
                <th>Usuario</th>
                <th>Evento</th>
                <th>Comentario</th>
                <th>Motivo Reporte</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((comentario) => (
                <tr key={comentario.id}>
                  {/* <td className="content">#{comentario.id}</td> */}
                  <td>
                    <div className="d-flex align-items-center">
                      {comentario.usuario.imagen && (
                        <img 
                          src={comentario.usuario.imagen} 
                          alt="Usuario" 
                          className="user-avatar me-2"
                        />
                      )}
                      <div>
                        <div>{comentario.usuario.nombre} {comentario.usuario.apellido}</div>
                        <small className="text-muted">{comentario.usuario.correo}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="comment-content">
                      <strong>{comentario.evento.nombre}</strong>
                      <div className="text-muted small">{comentario.evento.lugar.nombre}</div>
                      {comentario.evento.portada && (
                        <img 
                          src={comentario.evento.portada[0]} 
                          alt="Portada del evento" 
                          className="event-thumbnail mt-2"
                        />
                      )}
                    </div>
                  </td>
                  <td className="comment-content">
                    {comentario.contenido}
                  </td>
                  <td className="report-reason">
                    <span className="badge bg-warning text-dark">
                      {comentario.motivo_reporte}
                    </span>
                  </td>
                  <td className='comment-content'>
                    {new Date(comentario.fecha_hora).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-2">
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleAprobar(comentario.id)}
                      >
                        <i className="bi bi-check-circle me-1"></i>
                        Aprobar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRechazar(comentario.id)}
                      >
                        <i className="bi bi-x-circle me-1"></i>
                        Rechazar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportCometPageSuper;