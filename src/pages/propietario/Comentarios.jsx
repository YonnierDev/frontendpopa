import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Comentarios.css';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFlag, FaTimes, FaArrowLeft } from 'react-icons/fa';  // Eliminados los íconos de estrellas

const Comentarios = () => {
  const { id } = useParams();
  const [comentarios, setComentarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [motivoReporte, setMotivoReporte] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  // Función para obtener el primer lugar del propietario
  const obtenerPrimerLugar = async () => {
    try {
      const response = await api.get('/propietario/lugares');
      if (response.data && response.data.length > 0) {
        const primerLugar = response.data[0];
        return primerLugar.id;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener los lugares del propietario:', error);
      return null;
    }
  };

  useEffect(() => {
    const verificarSesionYCargar = async () => {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
      
      // Verificar si estamos en el cliente
      if (typeof window === 'undefined') return;
      
      // Verificar autenticación
      if (!token || !usuario) {
        console.log('No hay sesión activa, redirigiendo a login');
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        toast.error('Por favor inicia sesión para continuar');
        navigate('/login', { replace: true });
        return;
      }

      // Si no hay id, intentar obtener el primer lugar del propietario
      if (!id) {
        const primerLugarId = await obtenerPrimerLugar();
        if (primerLugarId) {
          // Redirigir a la ruta con el ID del primer lugar
          navigate(`/propietario/comentarios/${primerLugarId}`, { replace: true });
        } else {
          // Si no hay lugares, mostrar mensaje y redirigir al dashboard
          toast.error('No tienes lugares registrados');
          navigate('/propietario/dashboard');
        }
        return;
      }

      // Si llegamos aquí, tenemos un id válido
      try {
        await cargarComentarios();
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Manejar errores de autenticación
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login', { replace: true });
        } else {
          setError('Error al cargar los comentarios. Por favor, inténtalo de nuevo.');
        }
      } finally {
        setCargando(false);
      }
    };

    verificarSesionYCargar();
  }, [id, navigate]);

  const cargarComentarios = async () => {
    try {
      setCargando(true);
      setError('');
      
      // Obtener los comentarios del lugar específico del propietario
      const response = await api.get(`/api/propietario/lugar/${id}/comentarios`);
      
      if (response.data) {
        // Formatear los comentarios con la estructura esperada
        const comentariosFormateados = Array.isArray(response.data) 
          ? response.data.map(comentario => ({
              ...comentario,
              usuario: comentario.usuario || { 
                nombre: 'Usuario anónimo', 
                correo: comentario.usuario?.correo || '' 
              },
              evento: {
                id: comentario.evento?.id || 0,
                nombre: comentario.evento?.nombre || 'Evento sin nombre',
                lugarid: id
              },
              fecha: comentario.fecha_hora || new Date().toISOString(),
              estado: true, // Asumir activo si viene del backend
              contenido: comentario.contenido || 'Sin contenido',
              id: comentario.id
            }))
          : [];
        
        setComentarios(comentariosFormateados);
      } else {
        console.log('No hay comentarios para este lugar');
        setComentarios([]);
      }
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setComentarios([]);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('La sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError('Error al cargar los comentarios. Por favor, inténtalo de nuevo.');
      }
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
    if (!comentarioSeleccionado || !motivoReporte.trim()) {
      toast.warning('Por favor, selecciona un motivo para el reporte');
      return;
    }

    try {
      console.log('Enviando reporte para comentario:', comentarioSeleccionado.id);
      console.log('Motivo del reporte:', motivoReporte);
      
      // Usar el endpoint de reporte del backend con el formato correcto
      const response = await api.post(
        `/api/propietario/comentario/${comentarioSeleccionado.id}/reporte`,
        { motivo_reporte: motivoReporte }
      );

      // Si llegamos aquí, el reporte se creó exitosamente
      toast.success('Reporte enviado correctamente. El comentario será revisado por nuestro equipo.');
      
      // Actualizar el estado del comentario como reportado
      setComentarios(comentarios.map(com => 
        com.id === comentarioSeleccionado.id 
          ? { 
              ...com, 
              reportado: true,
              estado: 'inactivo',
              motivo_reporte: motivoReporte
            } 
          : com
      ));
      
      // Cerrar el modal y limpiar
      cerrarModal();
      setMotivoReporte('');
      
    } catch (error) {
      console.error('Error al enviar el reporte:', error);
      
      // Manejo de errores específicos
      if (error.response) {
        // El servidor respondió con un estado de error
        if (error.response.status === 400) {
          // Si el comentario ya fue reportado, marcarlo como tal en la interfaz
          if (error.response.data.error?.includes('ya ha sido reportado')) {
            setComentarios(comentarios.map(com => 
              com.id === comentarioSeleccionado.id 
                ? { ...com, reportado: true, estado: 'pendiente' } 
                : com
            ));
            toast.info('Este comentario ya ha sido reportado y está pendiente de revisión');
          } else {
            toast.error(error.response.data.error || 'No se pudo procesar la solicitud');
          }
        } else if (error.response.status === 401) {
          toast.error('No estás autorizado para realizar esta acción');
        } else if (error.response.status === 404) {
          toast.error('No se encontró el comentario');
        } else {
          toast.error('Ocurrió un error al procesar tu solicitud');
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        toast.error('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
      } else {
        // Error al configurar la petición
        toast.error('Error al enviar el reporte');
      }
      if (error.response) {
        const { status, data } = error.response;
        const errorMsg = data.message || data.error || 'Error al procesar el reporte';
        
        if (status === 400) {
          // Manejar diferentes tipos de errores 400
          if (errorMsg.includes('ya ha sido reportado')) {
            toast.warning('Este comentario ya ha sido reportado y está pendiente de revisión.');
            // Actualizar el estado del comentario como reportado
            setComentarios(comentarios.map(com => 
              com.id === comentarioSeleccionado.id 
                ? { ...com, reportado: true } 
                : com
            ));
            // Cerrar el modal ya que no es necesario mantenerlo abierto
            cerrarModal();
          } else {
            toast.warning(errorMsg || 'Datos inválidos en la solicitud');
          }
        } else if (status === 403) {
          toast.error('No tienes permiso para realizar esta acción');
        } else if (status === 404) {
          toast.error('El comentario no fue encontrado');
        } else {
          toast.error(`Error ${status}: ${errorMsg}`);
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        toast.error('No se recibió respuesta del servidor. Por favor, verifica tu conexión.');
      } else {
        // Error al configurar la solicitud
        toast.error('Error al configurar la solicitud: ' + error.message);
      }
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

  // Función para formatear la fecha
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const opciones = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };
  
  // Función auxiliar para obtener el estado del comentario
  const obtenerEstadoComentario = (comentario) => {
    if (comentario.aprobacion === 0) return 'pendiente';
    if (comentario.aprobacion === 1) return 'aprobado';
    if (comentario.reportado || comentario.estado === 'inactivo') return 'reportado';
    return 'sin_reporte';
  };

  // La función getClaseTarjeta ha sido eliminada ya que ahora manejamos los estilos directamente en el JSX

  // Filtrar comentarios por búsqueda
  const comentariosFiltrados = comentarios.filter(comentario => {
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      const textoComentario = `${comentario.usuario?.nombre || ''} ${comentario.contenido || ''}`.toLowerCase();
      return textoComentario.includes(textoBusqueda);
    }
    return true;
  });

  // Función para renderizar las estrellas de calificación (deshabilitada)
  const renderEstrellas = () => {
    return null; // No mostrar estrellas
  };
  
  // Función para obtener las iniciales del nombre
  const getIniciales = (nombre) => {
    if (!nombre) return '??';
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para manejar la eliminación de un comentario
  const handleEliminarComentario = async (comentarioId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      try {
        // Usar el endpoint de comentarios estándar para eliminar
        await api.delete(`/comentario/${comentarioId}`);
        toast.success('Comentario eliminado correctamente');
        cargarComentarios();
      } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        const errorMsg = error.response?.data?.error || 'Error al eliminar el comentario';
        toast.error(errorMsg);
      }
    }
  };

  // Función para manejar la edición de un comentario
  const handleEditarComentario = async (comentarioId, nuevoContenido) => {
    if (!nuevoContenido.trim()) {
      return toast.error('El comentario no puede estar vacío');
    }
    
    try {
      // Usar el endpoint de comentarios estándar para actualizar
      await api.patch(`/comentario/${comentarioId}`, {
        contenido: nuevoContenido
      });
      
      toast.success('Comentario actualizado correctamente');
      cargarComentarios();
      return true;
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
      const errorMsg = error.response?.data?.error || 'Error al actualizar el comentario';
      toast.error(errorMsg);
      return false;
    }
  };

  if (cargando) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted mt-2">Cargando comentarios...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        <div className="mb-4">
          <h1 className="h4 fw-bold mb-3">
            <i className="bi bi-chat-text me-2 text-primary"></i>
            Comentarios
            <span className="badge bg-primary bg-opacity-10 text-primary ms-2">
              {comentarios.length}
            </span>
          </h1>
        </div>
        
        {/* Barra de búsqueda */}
        <div className="mb-4">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar comentarios..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setBusqueda('')}
                type="button"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        {/* Lista de comentarios */}
        <div className="comments-container">
          {comentariosFiltrados.length > 0 ? (
            <div className="list-group">
              {comentariosFiltrados.map((comentario) => (
                <div 
                  key={comentario.id} 
                  className={`list-group-item list-group-item-action border-0 p-4 ${
                    obtenerEstadoComentario(comentario) === 'reportado' ? 'border-start border-3 border-danger' :
                    obtenerEstadoComentario(comentario) === 'pendiente' ? 'border-start border-3 border-warning' :
                    'border-start border-3 border-success'
                  }`}
                >
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div 
                        className="avatar d-flex align-items-center justify-content-center rounded-circle ${
                          obtenerEstadoComentario(comentario) === 'reportado' ? 'bg-danger bg-opacity-10 text-danger' :
                          obtenerEstadoComentario(comentario) === 'pendiente' ? 'bg-warning bg-opacity-10 text-warning' :
                          'bg-primary bg-opacity-10 text-primary'
                        }"
                        style={{ width: '42px', height: '42px', fontSize: '1rem' }}
                      >
                        {getIniciales(comentario.usuario?.nombre || 'U')}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-0 fw-bold">
                            {comentario.usuario?.nombre || 'Usuario anónimo'}
                            {obtenerEstadoComentario(comentario) === 'reportado' && (
                              <span className="badge bg-danger text-white ms-2">
                                <i className="bi bi-flag-fill me-1"></i>
                                Reportado
                              </span>
                            )}
                            {obtenerEstadoComentario(comentario) === 'pendiente' && (
                              <span className="badge bg-warning text-dark ms-2">
                                <i className="bi bi-hourglass-split me-1"></i>
                                En Revisión
                              </span>
                            )}
                            {obtenerEstadoComentario(comentario) === 'aprobado' && (
                              <span className="badge bg-success text-white ms-2">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Aprobado
                              </span>
                            )}
                          </h6>
                          <small className="text-muted">
                            {formatearFecha(comentario.fecha)}
                            {comentario.motivo_reporte && (
                              <span className="ms-2 text-danger">
                                <i className="bi bi-info-circle me-1"></i>
                                {comentario.motivo_reporte}
                              </span>
                            )}
                          </small>
                        </div>
                        {obtenerEstadoComentario(comentario) === 'sin_reporte' && (
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => abrirModalReporte(comentario)}
                          >
                            <FaFlag className="me-1" />
                            Reportar
                          </button>
                        )}
                      </div>
                      
                      <p className="mb-3">{comentario.contenido}</p>
                      
                      {comentario.evento?.nombre && (
                        <div className="mt-2">
                          <span className="badge bg-light text-dark border">
                            <i className="bi bi-calendar-event me-1"></i>
                            {comentario.evento.nombre}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 my-5 w-100">
              <div className="mb-3">
                <i className="bi bi-chat-square-text" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="text-muted">
                {busqueda 
                  ? 'No se encontraron comentarios que coincidan con tu búsqueda'
                  : 'No hay comentarios aún'}
              </h4>
              <p className="text-muted">
                {busqueda
                  ? 'Intenta con otros términos de búsqueda.'
                  : 'Los comentarios aparecerán aquí cuando los usuarios los dejen.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal de Reporte */}
        {showModal && comentarioSeleccionado && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-light">
                  <h5 className="modal-title d-flex align-items-center">
                    <FaFlag className="text-danger me-2" />
                    Reportar Comentario
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={cerrarModal}
                    aria-label="Cerrar"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning mb-3">
                    <strong>Importante:</strong> Los reportes son revisados por nuestro equipo. El uso indebido de esta función puede resultar en sanciones.
                  </div>
                  
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-start">
                        <div className="avatar-circle bg-primary text-white me-3">
                          {getIniciales(comentarioSeleccionado.usuario?.nombre || '??')}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="mb-0 fw-bold">
                              {comentarioSeleccionado.usuario?.nombre || 'Usuario anónimo'}
                            </h6>
                            <small className="text-muted">
                              {formatearFecha(comentarioSeleccionado.fecha)}
                            </small>
                          </div>
                          <p className="mb-0">{comentarioSeleccionado.contenido}</p>
                          
                          {comentarioSeleccionado.evento?.nombre && (
                            <div className="mt-2">
                              <small className="text-muted">
                                <i className="bi bi-calendar-event me-1"></i>
                                {comentarioSeleccionado.evento.nombre}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="motivo" className="form-label fw-medium">Motivo del reporte</label>
                    <select
                      className="form-select"
                      id="motivo"
                      value={motivoReporte}
                      onChange={(e) => setMotivoReporte(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un motivo</option>
                      <option value="contenido_inapropiado">Contenido inapropiado</option>
                      <option value="lenguaje_ofensivo">Lenguaje ofensivo o irrespetuoso</option>
                      <option value="spam">Spam o publicidad no deseada</option>
                      <option value="informacion_falsa">Información falsa o engañosa</option>
                      <option value="otro">Otro motivo</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="mensaje" className="form-label fw-medium">
                      Explicación adicional <span className="text-muted">(opcional)</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      rows={3}
                      placeholder="Proporciona más detalles sobre el problema..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                    />
                  </div>
                  
                  <div className="alert alert-info small mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    Tu reporte será revisado por nuestro equipo de moderación.
                  </div>
                </div>
                
                <div className="modal-footer bg-light border-top-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setComentarioSeleccionado(null);
                      setMotivoReporte('');
                      setMensaje('');
                    }}
                  >
                    <FaTimes className="me-1" /> Cancelar
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={enviarReporte}
                    disabled={!motivoReporte}
                  >
                    <FaFlag className="me-1" /> Enviar reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: '60px' }}
      />
    </div>
  );
};

export default Comentarios;
