import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import './Comentarios.css';
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      const response = await api.get('/comentarios/evento');
      setComentarios(response.data.comentarios || []);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      toast.error('Error al cargar los comentarios');
    } finally {
      setCargando(false);
    }
  };

  const handleShowModal = (comentario) => {
    setComentarioSeleccionado(comentario);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setComentarioSeleccionado(null);
    setMotivoReporte('');
  };

  const reportarComentario = async () => {
    try {
      if (!comentarioSeleccionado || !motivoReporte.trim()) {
        toast.error('Por favor ingrese un motivo para el reporte');
        return;
      }

      const comentarioId = comentarioSeleccionado.id;

      if (!comentarioId) {
        toast.error('ID del comentario inválido');
        return;
      }

      await api.post(`/comentario/${comentarioId}/reportar`, {
        motivo: motivoReporte,
      });

      toast.success('Comentario reportado correctamente');
      handleCloseModal();
      cargarComentarios();
    } catch (error) {
      console.error('Error al reportar el comentario:', error);
      const mensaje =
        error?.response?.data?.mensaje || 'Error al reportar el comentario';
      toast.error(mensaje);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        <h1>Comentarios</h1>

        {cargando ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Lugar</th>
                  <th>Comentario</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Reportes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.map((comentario) => (
                  <tr key={comentario.id}>
                    <td>{comentario.evento?.nombre}</td>
                    <td>{comentario.lugar?.nombre}</td>
                    <td>{comentario.contenido}</td>
                    <td>{new Date(comentario.fecha_hora).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-success">Activo</span>
                    </td>
                    <td>
                      {comentario.reportado ? (
                        <span className="badge bg-danger">Reportado</span>
                      ) : (
                        <span className="badge bg-success">Sin Reportes</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleShowModal(comentario)}
                      >
                        Reportar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Reporte */}
        {showModal && comentarioSeleccionado && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reportar Comentario</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="comentario" className="form-label">
                      Comentario a reportar:
                    </label>
                    <p id="comentario" className="border p-2 rounded">
                      {comentarioSeleccionado.contenido}
                    </p>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="motivo" className="form-label">
                      Motivo del reporte:
                    </label>
                    <textarea
                      id="motivo"
                      className="form-control"
                      value={motivoReporte}
                      onChange={(e) => setMotivoReporte(e.target.value)}
                      rows="3"
                      placeholder="Ingrese el motivo del reporte"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={reportarComentario}
                  >
                    Reportar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Comentarios;
