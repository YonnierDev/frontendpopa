import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import './Comentarios.css';
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      const response = await api.get("/comentarios");
      setComentarios(response.data.datos || []);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
      toast.error('Error al cargar los comentarios');
    } finally {
      setCargando(false);
    }
  };

  const handleSolicitarOcultar = async (comentarioId) => {
    setComentarioSeleccionado(comentarioId);
    setMotivoReporte('');
  };

  const handleEnviarSolicitud = async () => {
    if (!motivoReporte.trim()) {
      toast.error('Por favor, ingrese el motivo del reporte');
      return;
    }

    try {
      await api.post(`/comentario/${comentarioSeleccionado}/reportar`, {
        motivo_reporte: motivoReporte
      });
      toast.success('Solicitud enviada correctamente');
      setComentarioSeleccionado(null);
      setMotivoReporte('');
      cargarComentarios();
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      toast.error('Error al enviar la solicitud');
    }
  };

  return (
    <div className="comentarios-container">
      <Sidebar />
      <div className="content-container">
        <h1>Gestión de Comentarios</h1>

        {cargando ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Comentario</th>
                  <th>Lugar</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comentarios?.map((comentario) => (
                  <tr key={comentario.id}>
                    <td>
                      <div>
                        <div>{comentario.usuario?.nombre}</div>
                        <small className="text-muted">{comentario.usuario?.correo}</small>
                      </div>
                    </td>
                    <td>{new Date(comentario.fecha).toLocaleString()}</td>
                    <td>{comentario.contenido}</td>
                    <td>{comentario.lugar?.nombre}</td>
                    <td>
                      <span className={`badge ${comentario.visible ? 'bg-success' : 'bg-danger'}`}>
                        {comentario.visible ? 'Visible' : 'Oculto'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleSolicitarOcultar(comentario.id)}
                        disabled={!comentario.visible}
                      >
                        Solicitar Ocultar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal para solicitar ocultar comentario */}
        {comentarioSeleccionado && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Solicitar Ocultar Comentario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setComentarioSeleccionado(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="motivoReporte" className="form-label">
                      Motivo del reporte:
                    </label>
                    <textarea
                      id="motivoReporte"
                      className="form-control"
                      rows="3"
                      value={motivoReporte}
                      onChange={(e) => setMotivoReporte(e.target.value)}
                      placeholder="Explique por qué desea ocultar este comentario..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setComentarioSeleccionado(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEnviarSolicitud}
                  >
                    Enviar Solicitud
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
};

export default Comentarios;
