import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Comentarios = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/propietario/lugares');
      return;
    }
    cargarComentarios();
  }, [id, navigate]);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const comentariosRes = await fetch('https://popnocturna.vercel.app/api/comentarios', {
        headers: {
          'Authorization': `Bearer ${usuario?.token}`,
          'Content-Type': 'application/json'
        }
      });
      if (comentariosRes.ok) {
        const comentariosData = await comentariosRes.json();
        const comentariosLugar = (comentariosData.comentarios || []).filter(com => {
          // Si el comentario tiene lugar directo
          if (com.lugar && Number(com.lugar.id) === Number(id)) return true;
          // Si el comentario tiene evento y el evento tiene lugar
          if (com.evento && com.evento.lugar && Number(com.evento.lugar.id) === Number(id)) return true;
          return false;
        });
        
        // Verificar si los comentarios tienen la estructura esperada
        console.log('Estructura de los comentarios:', comentariosLugar[0]);
        
        // Asegurarse de que los comentarios tengan la estructura correcta
        const comentariosFormateados = comentariosLugar.map(com => ({
          ...com,
          usuario: com.usuario || {},
          lugar: com.lugar || {},
          evento: com.evento || {}
        }));
        
        console.log('Comentarios formateados:', comentariosFormateados);
        setComentarios(comentariosFormateados);
        console.log('Comentarios filtrados para este lugar:', comentariosLugar);
        setComentarios(comentariosLugar);
      } else {
        setComentarios([]);
      }
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      toast.error('Error al cargar los comentarios');
    } finally {
      setCargando(false);
    }
  };

  const abrirModalReporte = (comentario) => {
    setComentarioSeleccionado(comentario);
    setMotivoReporte('');
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setComentarioSeleccionado(null);
  };

  const enviarReporte = async () => {
    if (!motivoReporte.trim()) {
      return toast.error('Escribe un motivo para el reporte');
    }
    try {
      await api.post(`/comentario/${comentarioSeleccionado.id}/reportar`, {
        motivo: motivoReporte,
      });
      toast.success('Reporte enviado');
      cerrarModal();
      cargarComentarios();
    } catch (err) {
      console.error('Error al enviar el reporte – detalles del servidor:', err.response?.data);
      toast.error(err.response?.data?.mensaje || 'Error al enviar el reporte');
    }
  };

  const renderBadge = (tipo, valor) => {
    let clases = 'badge ';
    switch (tipo) {
      case 'estado':
        clases += valor ? 'bg-success' : 'bg-secondary';
        return <span className={clases}>{valor ? 'Activo' : 'Inactivo'}</span>;
      case 'reportado':
        clases += valor ? 'bg-danger' : 'bg-success';
        return <span className={clases}>{valor ? 'Reportado' : 'Sin Reportes'}</span>;
      default:
        return null;
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
                  <th>Nombre de Usuario</th>
                  <th>Nombre de Evento</th>
                  <th>Nombre de Lugar</th>
                  <th>Contenido del Comentario</th>
                  <th>Fecha y Hora</th>
                  <th>Estado</th>
                  <th>Estado de Reportes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {comentarios.length === 0 && (
                  <tr>
                    <td colSpan="8" className="sin-datos">
                      No hay comentarios disponibles.
                    </td>
                  </tr>
                )}
                {comentarios.map((c) => (
                  <tr key={c.id}>
                    <td>{c.usuario?.nombre || '—'}</td>
                    <td>{c.evento?.nombre || '—'}</td>
                    <td>{c.lugar?.nombre || c.evento?.lugar?.nombre || '—'}</td>
                    <td>{c.contenido}</td>
                    <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                    <td>{renderBadge('estado', c.estado)}</td>
                    <td>{renderBadge('reportado', c.motivo_reporte)}</td>
                    <td>
                      {c.motivo_reporte ? (
                        <button className="btn btn-sm btn-warning" disabled>
                          Reportado
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => abrirModalReporte(c)}
                        >
                          Reportar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de Reporte */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reportar Comentario</h5>
                  <button type="button" className="btn-close" onClick={cerrarModal} />
                </div>
                <div className="modal-body">
                  <p>{comentarioSeleccionado.contenido}</p>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={motivoReporte}
                    onChange={(e) => setMotivoReporte(e.target.value)}
                    placeholder="Motivo del reporte"
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button className="btn btn-warning" onClick={enviarReporte}>
                    Enviar
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
