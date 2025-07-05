import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../components/api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Calificaciones.css';
import Sidebar from '../../components/Sidebar';

const styles = {
  noCalificaciones: {
    textAlign: 'center',
    color: '#666',
    padding: '20px',
    fontSize: '1.2em'
  }
};

const Calificaciones = () => {
  const { lugarid } = useParams();
  const [calificaciones, setCalificaciones] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Función para obtener el primer lugar del propietario
  const obtenerPrimerLugar = async () => {
    try {
      const response = await api.get('/api/propietario/lugares');
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

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const verificarAutenticacion = () => {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
      
      if (!token || !usuario) {
        toast.error('Por favor inicia sesión para continuar');
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login', { replace: true });
        return false;
      }
      return true;
    };
    
    if (!verificarAutenticacion()) return;
    
    // Si no hay lugarid, intentar obtener el primer lugar del propietario
    const manejarLugarNoEspecificado = async () => {
      const primerLugarId = await obtenerPrimerLugar();
      if (primerLugarId) {
        // Redirigir a la ruta con el ID del primer lugar
        navigate(`/propietario/calificaciones/${primerLugarId}`, { replace: true });
      } else {
        // Si no hay lugares, mostrar mensaje y redirigir al dashboard
        toast.error('No tienes lugares registrados');
        navigate('/propietario/dashboard');
      }
    };
    
    if (!lugarid) {
      manejarLugarNoEspecificado();
      return;
    }
    
    // Si llegamos aquí, tenemos un lugarid válido
    const cargarDatos = async () => {
      try {
        setCargando(true);
        await cargarCalificaciones();
      } catch (error) {
        console.error('Error al cargar datos:', error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Manejar errores de autenticación
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login', { replace: true });
        } else {
          setError('Error al cargar las calificaciones. Por favor, inténtalo de nuevo.');
        }
      } finally {
        setCargando(false);
      }
    };
    
    cargarDatos();
    
    return () => {
      // Limpieza si es necesario
    };
  }, [lugarid, navigate]);

  const cargarCalificaciones = async () => {
    try {
      setCargando(true);
      setError('');
      
      // Usar el endpoint correcto del backend
      const response = await api.get(`/api/propietario/lugar/${lugarid}/calificaciones`);
      
      // El backend devuelve directamente el array de calificaciones
      setCalificaciones(response.data || []);
      setMensaje('');
    } catch (error) {
      console.error('Error al cargar calificaciones:', error.response || error);
      setCalificaciones([]);
      setError('Error al cargar las calificaciones. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  // Función para formatear fechas de manera segura
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    
    try {
      const fecha = new Date(fechaString);
      return isNaN(fecha.getTime()) ? 'N/A' : fecha.toLocaleDateString('es-ES');
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'N/A';
    }
  };

  // Ordenar calificaciones por fecha (más reciente primero)
  const calificacionesOrdenadas = [...calificaciones].sort((a, b) => {
    const fechaA = a.createdAt ? new Date(a.createdAt) : new Date(0);
    const fechaB = b.createdAt ? new Date(b.createdAt) : new Date(0);
    return fechaB - fechaA;
  });

  const calcularPromedio = () => {
    if (calificaciones.length === 0) return 0;
    const suma = calificaciones.reduce((total, cal) => {
      // Usar calificacion.puntuacion si existe, de lo contrario usar calificacion.calificacion
      const puntuacion = parseFloat(cal.puntuacion) || parseFloat(cal.calificacion) || 0;
      return total + puntuacion;
    }, 0);
    return (suma / calificaciones.length).toFixed(1);
  };

  const promedioCalificaciones = calcularPromedio();

  const verDetalle = async (id) => {
    console.log('ID recibido en verDetalle:', id);
    
    if (!id) {
      console.error('Error: No se proporcionó un ID de calificación');
      setMensaje('Error: No se pudo identificar la calificación seleccionada');
      return;
    }
    
    try {
      setCargando(true);
      setMensaje('');
      
      console.log(`Solicitando detalles para la calificación ID: ${id}`);
      
      // Verificar primero si la calificación ya está en la lista
      const calificacionExistente = calificaciones.find(c => c.id == id || c._id == id);
      
      if (calificacionExistente) {
        console.log('Usando datos de calificación existente:', calificacionExistente);
        setDetalleSeleccionado(calificacionExistente);
        return;
      }
      
      // Si no está en la lista, hacer la petición al servidor
      const response = await api.get(`/api/calificacion/${id}`);
      console.log('Respuesta de la API:', response);
      
      if (!response.data) {
        throw new Error('La respuesta del servidor no contiene datos');
      }
      
      const detalle = response.data.datos || response.data;
      
      if (!detalle) {
        throw new Error('No se encontraron datos de la calificación');
      }
      
      console.log('Detalle a mostrar:', detalle);
      setDetalleSeleccionado(detalle);
      
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los detalles de la calificación';
      const status = error.response?.status;
      
      setMensaje(`Error: ${errorMessage}`);
      setDetalleSeleccionado(null);
      
      // Mostrar notificación de error
      if (status === 404) {
        toast.error('La calificación solicitada no fue encontrada');
      } else if (status === 500) {
        toast.error('Error en el servidor al obtener la calificación');
      } else if (error.message === 'Network Error') {
        toast.error('Error de conexión. Verifica tu conexión a internet');
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setCargando(false);
    }
  };

  const cerrarDetalle = () => {
    setDetalleSeleccionado(null);
  };

  if (cargando) {
    return (
      <div className="calificaciones-container">
        <Sidebar />
        <div className="calificaciones-content">
          <div className="loading-spinner"></div>
          <p>Cargando calificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calificaciones-container">
        <Sidebar />
        <div className="calificaciones-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!lugarid) {
    return (
      <div className="calificaciones-container">
        <Sidebar />
        <div className="calificaciones-content">
          <div className="info-message">
            <p>Selecciona un lugar para ver sus calificaciones</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div style={{ textAlign: 'right', margin: '16px 0 24px 0' }}>
          <h2>Calificaciones del Lugar</h2>
        </div>
        
        {cargando ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="estadisticas">
              <div className="estadistica-item">
                <div className="estadistica-label">Puntuación promedio</div>
                <div className="estadistica-valor">{promedioCalificaciones}</div>
                <div className="estrellas">
                  {'★'.repeat(Math.round(promedioCalificaciones))}
                  {'☆'.repeat(5 - Math.round(promedioCalificaciones))}
                </div>
              </div>
              
              <div className="estadistica-item">
                <div className="estadistica-label">Total de reseñas</div>
                <div className="estadistica-valor">{calificaciones.length}</div>
                <div style={{ fontSize: '14px', color: '#718096' }}>Reseñas registradas</div>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="tabla-calificaciones">
                <thead>
                  <tr>
                    <th style={{ color: '#000000', fontWeight: '700', padding: '16px 20px', backgroundColor: '#ffffff', borderBottom: '2px solid #000000' }}>Usuario</th>
                    <th style={{ color: '#000000', fontWeight: '700', padding: '16px 20px', backgroundColor: '#ffffff', borderBottom: '2px solid #000000' }}>Calificación</th>
                    <th style={{ color: '#000000', fontWeight: '700', padding: '16px 20px', backgroundColor: '#ffffff', borderBottom: '2px solid #000000' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {calificaciones.length > 0 ? (
                    calificaciones.map((calificacion, index) => {
                      console.log('Datos de la calificación:', calificacion); // Para depuración
                      return (
                        <tr key={calificacion.id || calificacion._id || `calificacion-${index}`}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              color: '#4a5568'
                            }}>
                              {calificacion.usuario?.nombre?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600' }}>{calificacion.usuario?.nombre || 'Usuario anónimo'}</div>
                              <div style={{ fontSize: '12px', color: '#718096' }}>
                                {calificacion.usuario?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="estrellas" style={{ color: '#f6ad55' }}>
                              {'★'.repeat(calificacion.puntuacion || calificacion.calificacion || 0)}
                              {'☆'.repeat(5 - (calificacion.puntuacion || calificacion.calificacion || 0))}
                            </span>
                            <span style={{ 
                              backgroundColor: '#f6f0e8', 
                              borderRadius: '12px',
                              padding: '4px 10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#805ad5'
                            }}>
                              {calificacion.puntuacion || calificacion.calificacion || 0}.0
                            </span>
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn-detalle"
                            onClick={() => {
                              console.log('ID al hacer clic:', calificacion.id || calificacion._id);
                              verDetalle(calificacion.id || calificacion._id);
                            }}
                          >
                            <i className="fas fa-eye"></i> Ver
                          </button>
                        </td>
                      </tr>
                      );
                    })
                  ) : (
                    <tr key="no-calificaciones">
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '16px' }}>No hay calificaciones para mostrar</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal para ver detalles completos */}
        {detalleSeleccionado && (
          <div className="modal-overlay" onClick={() => setDetalleSeleccionado(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              {cargando ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="loading-spinner"></div>
                  <p style={{ marginTop: '16px' }}>Cargando detalles...</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Detalles de la reseña</h3>
                    <button 
                      onClick={() => setDetalleSeleccionado(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#718096',
                        padding: '0 8px'
                      }}
                    >
                      &times;
                    </button>
                  </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px',
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#4a5568',
                  flexShrink: 0
                }}>
                  {detalleSeleccionado.usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#2d3748' }}>
                    {detalleSeleccionado.usuario?.nombre || 'Usuario anónimo'}
                  </div>
                  <div style={{ color: '#718096', marginBottom: '12px', fontSize: '14px' }}>
                    {detalleSeleccionado.usuario?.email || 'Correo no disponible'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="estrellas" style={{ fontSize: '20px', color: '#f6ad55' }}>
                      {'★'.repeat(detalleSeleccionado.puntuacion || detalleSeleccionado.calificacion || 0)}
                      {'☆'.repeat(5 - (detalleSeleccionado.puntuacion || detalleSeleccionado.calificacion || 0))}
                    </div>
                    <span style={{ 
                      backgroundColor: '#f6f0e8',
                      color: '#805ad5',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {(detalleSeleccionado.puntuacion || detalleSeleccionado.calificacion || 0)}.0/5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div style={{ marginBottom: '20px' }}>
                {detalleSeleccionado.comentario && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px', color: '#4a5568' }}>Comentario:</div>
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '8px',
                      borderLeft: '3px solid #805ad5'
                    }}>
                      {detalleSeleccionado.comentario}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {detalleSeleccionado.evento?.nombre && (
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Evento:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bi bi-calendar-event" style={{ color: '#805ad5' }}></i>
                        <span>{detalleSeleccionado.evento.nombre}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px', color: '#4a5568' }}>Fecha:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="bi bi-calendar3" style={{ color: '#805ad5' }}></i>
                      <span>{formatearFecha(detalleSeleccionado.createdAt || detalleSeleccionado.fecha)}</span>
                    </div>
                  </div>
                </div>
              </div>
              

                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calificaciones;