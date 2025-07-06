import React, { useState, useEffect, useCallback } from 'react';
import { api } from "../../components/api/api";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './Reservas.css';
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Constantes para estados de reserva
const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  ACEPTADO: 'aceptado',
  RECHAZADO: 'rechazado',
  CANCELADO: 'cancelado'
};

// Estructura de datos para los filtros
const FILTROS_INICIALES = {
  estado: '',
  fechaDesde: null,
  fechaHasta: null,
  busqueda: ''
};

// Configuración de paginación
const PAGINACION_INICIAL = {
  pagina: 1,
  totalPaginas: 1,
  totalItems: 0,
  limite: 10
};

const Reservas = () => {
  // Hook para forzar la actualización del componente
  const [_, forceUpdate] = React.useState({});
  
  // Estado para el modal de detalle de reserva
  const [modalShow, setModalShow] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  
  // Función para abrir el modal con la reserva seleccionada
  const handleShowModal = (reserva) => {
    console.log('Datos de la reserva seleccionada:', reserva);
    console.log('Datos del evento en la reserva:', reserva.evento);
    console.log('Propiedades del evento:', reserva.evento ? Object.keys(reserva.evento) : 'No hay datos de evento');
    setReservaSeleccionada(reserva);
    setModalShow(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalShow(false);
    document.body.style.overflow = 'auto';
  };
  
  // Efecto para limpiar el estado cuando el modal se cierra
  useEffect(() => {
    if (!modalShow) {
      const timer = setTimeout(() => {
        setReservaSeleccionada(null);
      }, 300); // Tiempo para la animación de cierre
      return () => clearTimeout(timer);
    }
  }, [modalShow]);
  
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    estado: '',
    fechaDesde: null,
    fechaHasta: null,
    busqueda: ''
  });
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    totalPaginas: 1,
    totalItems: 0,
    limite: 10
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { id: lugarId } = useParams(); // Obtener el ID del lugar de la URL

  // Estado para controlar si es la carga inicial
  const [cargaInicial, setCargaInicial] = useState(true);
  
  // Cargar datos cuando cambian los parámetros de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const estado = searchParams.get('estado') || '';
    const pagina = parseInt(searchParams.get('pagina') || '1', 10);
    const busqueda = searchParams.get('busqueda') || '';
    
    // Actualizar estado local con los parámetros de la URL
    setFiltros(prev => ({
      ...prev,
      estado,
      busqueda
    }));
    
    setPaginacion(prev => ({
      ...prev,
      pagina
    }));
    
    // Cargar reservas con los parámetros actuales
    cargarReservas(pagina, estado, busqueda);
  }, [location.search]);

  // Función para manejar errores de la API
  const manejarErrorAPI = useCallback((error, mensajePersonalizado = '') => {
    console.error(mensajePersonalizado, error);
    
    let mensajeError = mensajePersonalizado || 'Ocurrió un error inesperado';
    
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      if (error.response.status === 401 || error.response.status === 403) {
        mensajeError = 'No tienes permiso para realizar esta acción';
      } else if (error.response.status === 404) {
        mensajeError = 'Recurso no encontrado';
      } else if (error.response.data?.mensaje) {
        mensajeError = error.response.data.mensaje;
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      mensajeError = 'No se recibió respuesta del servidor';
    } else if (error.code === 'ECONNABORTED') {
      mensajeError = 'La solicitud está tardando demasiado. Por favor, inténtalo de nuevo.';
    } else if (!navigator.onLine) {
      mensajeError = 'No hay conexión a Internet. Verifica tu conexión.';
    }
    
    setError(mensajeError);
    toast.error(mensajeError, { autoClose: 5000 });
  }, []);

  // Función para cargar las reservas
  const cargarReservas = useCallback(async (pagina = 1, estado = '', busqueda = '', skipUpdate = false) => {
    if (skipUpdate) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      setCargando(true);
      setError(null);
      
      // Actualizar estado local con los parámetros actuales
      setFiltros(prev => ({
        ...prev,
        estado,
        busqueda
      }));
      
      // Construir parámetros de consulta para la API
      const params = new URLSearchParams({
        page: pagina,
        limit: 10,
        include: 'evento'  // Incluir datos completos del evento
      });
      
      if (estado) params.append('estado', estado);
      if (busqueda) params.append('busqueda', busqueda);
      
      console.log('Solicitando reservas con parámetros:', params.toString());
      
      // Usar el endpoint específico del lugar
      const endpoint = lugarId 
        ? `/api/propietario/lugar/${lugarId}/reservas?${params.toString()}`
        : `/api/reservas?${params.toString()}`;
      
      console.log('Solicitando reservas con endpoint:', endpoint);
      
      // Hacer la petición al backend
      const response = await api.get(endpoint, {
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      clearTimeout(timeoutId);
      
      // Procesar la respuesta
      const responseData = response.data;
      let reservasData = [];
      let metadata = {};
      let totalItems = 0;
      let totalPages = 1;
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(responseData)) {
        reservasData = responseData;
        totalItems = reservasData.length;
        totalPages = Math.ceil(totalItems / 10);
      } else if (responseData.datos) {
        reservasData = responseData.datos;
        metadata = responseData.metadata || {};
        totalItems = metadata.total || reservasData.length;
        totalPages = metadata.totalPaginas || Math.ceil(totalItems / 10) || 1;
      } else if (responseData.data) {
        reservasData = responseData.data;
        metadata = responseData.metadata || responseData.meta || {};
        totalItems = metadata.total || reservasData.length;
        totalPages = metadata.totalPaginas || metadata.last_page || Math.ceil(totalItems / 10) || 1;
      }
      
      // Asegurar que cada reserva tenga los campos necesarios
      const processedData = reservasData.map(reserva => ({
        ...reserva,
        aprobacion: reserva.aprobacion || (reserva.estado ? 'aceptado' : 'rechazado') || 'pendiente',
        estado: typeof reserva.estado === 'boolean' ? reserva.estado : (reserva.estado === 'aceptado')
      }));
      
      // Actualizar estado con los datos de las reservas
      setReservas(processedData);
      
      // Actualizar paginación
      setPaginacion(prev => ({
        ...prev,
        pagina,
        totalPaginas: totalPages,
        totalItems: totalItems,
        limite: 10
      }));
      
      // Actualizar URL para reflejar los filtros actuales
      const newParams = new URLSearchParams();
      if (estado) newParams.set('estado', estado);
      if (busqueda) newParams.set('busqueda', busqueda);
      if (pagina > 1) newParams.set('pagina', pagina);
      
      const queryString = newParams.toString();
      const newUrl = queryString 
        ? `${window.location.pathname}?${queryString}` 
        : window.location.pathname;
      
      // Solo actualizar la URL si es diferente
      if (window.location.search !== `?${queryString}`) {
        window.history.pushState({}, '', newUrl);
      }
      
      return { data: processedData, totalItems, totalPages };
      
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      
      if (error.name === 'AbortError') {
        setError('La solicitud está tardando demasiado. Por favor, inténtalo de nuevo.');
        toast.error('La solicitud está tardando demasiado');
      } else {
        setError('Error al cargar las reservas. Por favor, inténtalo de nuevo.');
        toast.error('Error al cargar las reservas');
        manejarErrorAPI(error, 'Error al cargar las reservas');
      }
      
      return { data: [], totalItems: 0, totalPages: 1 };
      
    } finally {
      clearTimeout(timeoutId);
      setCargando(false);
    }
  }, [manejarErrorAPI]); // Agregamos manejarErrorAPI como dependencia

  // Función para manejar la aprobación/rechazo de reservas
  const handleAprobarReserva = async (reserva, accion) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('No se encontró el token de autenticación');
      return;
    }

    // Mostrar confirmación
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas ${accion === 'aceptado' ? 'aceptar' : 'rechazar'} esta reserva?`
    );
    
    if (!confirmar) return;

    const loadingToast = toast.loading(
      accion === 'aceptado' ? 'Aceptando reserva...' : 'Rechazando reserva...'
    );

    try {
      // 1. Obtener el número de reserva
      const numeroReserva = reserva?.numero_reserva || reserva?.numeroReserva;
      if (!numeroReserva) {
        throw new Error('No se pudo identificar el número de reserva');
      }
      
      // 2. Hacer la petición al endpoint correcto
      const response = await api.patch(
        `/api/reserva/aprobar/${numeroReserva}`,
        { aprobacion: accion },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      if (!response.data) {
        throw new Error('No se recibió respuesta del servidor');
      }

      const { success, mensaje, data } = response.data;
      
      if (!success) {
        throw new Error(mensaje || 'Error al procesar la solicitud');
      }

      console.log('[DEBUG] Respuesta del servidor:', response.data);

      // 3. Actualizar el estado local con los datos devueltos por el servidor
      if (data) {
        setReservas(prevReservas => 
          prevReservas.map(item => 
            item.numero_reserva === data.numero_reserva
              ? { 
                  ...item, 
                  aprobacion: data.aprobacion,
                  estado: data.estado,
                  updatedAt: data.fecha_actualizacion || new Date().toISOString()
                }
              : item
          )
        );
      } else {
        // Si no hay datos en la respuesta, forzar recarga
        await cargarReservas(paginacion.pagina, filtros.estado, filtros.busqueda);
      }

      // 4. Mostrar mensaje de éxito
      toast.update(loadingToast, {
        render: mensaje || `Reserva ${accion} correctamente`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      
      return response.data;
      
    } catch (error) {
      console.error('Error en la petición:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let mensajeError = 'Ocurrió un error inesperado';
      
      if (error.response?.data?.mensaje) {
        mensajeError = error.response.data.mensaje;
      } else if (error.code === 'ECONNABORTED') {
        mensajeError = 'La solicitud está tardando demasiado. Por favor, inténtalo de nuevo.';
      } else if (error.message) {
        mensajeError = error.message;
      } else if (!navigator.onLine) {
        mensajeError = 'No hay conexión a Internet. Verifica tu conexión.';
      }
      
      // Mostrar mensaje de error
      toast.update(loadingToast, {
        render: `Error al ${accion === 'aceptado' ? 'aceptar' : 'rechazar'} la reserva: ${mensajeError}`,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
      
      throw error;
    } finally {
      setCargando(false);
    }
  };
  
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFechaChange = (date, field) => {
    setFiltros(prev => ({
      ...prev,
      [field]: date
    }));
  };
  
  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    if (filtros.estado) params.set('estado', filtros.estado);
    if (filtros.busqueda) params.set('busqueda', filtros.busqueda);
    if (filtros.fechaDesde) params.set('fechaDesde', filtros.fechaDesde.toISOString().split('T')[0]);
    if (filtros.fechaHasta) params.set('fechaHasta', filtros.fechaHasta.toISOString().split('T')[0]);
    
    navigate(`?${params.toString()}`);
  };
  
  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      fechaDesde: null,
      fechaHasta: null,
      busqueda: ''
    });
    navigate('?pagina=1');
  };
  
  const cambiarPagina = (nuevaPagina) => {
    const params = new URLSearchParams(location.search);
    params.set('pagina', nuevaPagina);
    navigate(`?${params.toString()}`);
  };
  
  const renderPaginacion = () => {
    const paginas = [];
    const { pagina, totalPaginas } = paginacion;
    
    // Mostrar máximo 5 páginas en la navegación
    let inicio = Math.max(1, pagina - 2);
    let fin = Math.min(totalPaginas, inicio + 4);
    
    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(
        <button
          key={i}
          className={`btn ${i === pagina ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
          onClick={() => cambiarPagina(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => cambiarPagina(1)}
          disabled={pagina === 1}
        >
          «
        </button>
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => cambiarPagina(Math.max(1, pagina - 1))}
          disabled={pagina === 1}
        >
          &lsaquo;
        </button>
        {paginas}
        <button
          key="next-page"
          className="btn btn-outline-primary mx-1"
          onClick={() => cambiarPagina(Math.min(totalPaginas, pagina + 1))}
          disabled={pagina === totalPaginas}
        >
          &rsaquo;
        </button>
        <button
          key="last-page"
          className="btn btn-outline-primary mx-1"
          onClick={() => cambiarPagina(totalPaginas)}
          disabled={pagina === totalPaginas}
        >
          &raquo;
        </button>
      </div>
    );
  };

  // Función para obtener el texto del estado
  const getEstadoTexto = (aprobacion) => {
    switch(aprobacion) {
      case 'aceptado':
        return 'Aceptada';
      case 'rechazado':
        return 'Rechazada';
      case 'pendiente':
        return 'Pendiente';
      default:
        return aprobacion || 'Pendiente';
    }
  };

  // Función para obtener la clase CSS según el estado de aprobación
  const getAprobacionBadgeClass = useCallback((estado) => {
    switch ((estado || '').toLowerCase()) {
      case ESTADOS_RESERVA.ACEPTADO:
        return 'badge-aceptado';
      case ESTADOS_RESERVA.RECHAZADO:
        return 'badge-rechazado';
      case ESTADOS_RESERVA.PENDIENTE:
        return 'badge-pendiente';
      case ESTADOS_RESERVA.CANCELADO:
        return 'bg-secondary';
      default:
        return 'badge-pendiente';
    }
  }, []);

  // Función para formatear fechas
  const formatDate = useCallback((dateString) => {
    try {
      if (!dateString) return 'No especificada';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Fecha inválida:', dateString);
        return 'Fecha no disponible';
      }
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Bogota' // Ajusta según la zona horaria necesaria
      };
      
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  }, []);

  // Función para filtrar reservas según el término de búsqueda
  const filtrarReservas = useCallback(() => {
    if (!filtros.busqueda) return reservas;
    
    const searchTerm = filtros.busqueda.toLowerCase();
    return reservas.filter(reserva => 
      (reserva.evento?.nombre || '').toLowerCase().includes(searchTerm) ||
      (reserva.evento?.lugar?.nombre || '').toLowerCase().includes(searchTerm) ||
      (reserva.lugar?.nombre || '').toLowerCase().includes(searchTerm)
    );
  }, [reservas, filtros.busqueda]);

  // Renderizado del componente
  return (
    <div className="reservas-container">
      <ToastContainer 
        position="top-right" 
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Sidebar />
      <div className="content">
      <div className="page-header">
        <h1>Gestión de Reservas</h1>
        <div className="d-flex align-items-center">
          <span className="badge bg-primary me-3">
            <i className="bi bi-calendar-check me-1"></i>
            {paginacion.totalItems} {paginacion.totalItems === 1 ? 'reserva' : 'reservas'}
          </span>
        </div>
      </div>
        
      {/* Búsqueda mejorada */}
      <div className="filtros-container">
        <div className="filtros-header">
          <h5>Buscar reservas</h5>
        </div>
        <div className="search-container">
          <div className="search-input-group">
            <input
              type="text"
              name="busqueda"
              className="search-input"
              placeholder="Buscar por nombre del evento, lugar o detalles..."
              value={filtros.busqueda}
              onChange={handleFiltroChange}
              onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
            />
            <button 
              className="search-button"
              onClick={aplicarFiltros}
              title="Buscar"
            >
              <i className="bi bi-search"></i>
              <span>Buscar</span>
            </button>
          </div>
          {filtros.busqueda && (
            <div className="text-end mt-2">
              <button 
                className="btn btn-sm btn-link text-muted"
                onClick={() => {
                  setFiltros(prev => ({ ...prev, busqueda: '' }));
                  aplicarFiltros();
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Sección de migas de pan y contador */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/propietario">Inicio</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Reservas</li>
            </ol>
          </nav>
        </div>
      </div>
      {cargando ? (
        <div className="estado-carga">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando reservas...</p>
        </div>
      ) : filtrarReservas().length === 0 ? (
        <div className="estado-carga">
          <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
          <h4 className="text-muted mt-3">No se encontraron reservas</h4>
          <p className="text-muted">
            {filtros.estado || filtros.busqueda 
              ? 'Intenta con otros filtros o crea una nueva reserva'
              : 'No hay reservas registradas en este momento.'}
          </p>
          {(filtros.estado || filtros.busqueda) && (
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={() => {
                setFiltros(FILTROS_INICIALES);
                navigate('/propietario/reservas');
              }}
            >
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="reservas-lista">
          {filtrarReservas().map((reserva, index) => {
            const esAceptada = reserva.aprobacion === 'aceptado';
            const esRechazada = reserva.aprobacion === 'rechazado';
            
            return (
              <div 
                key={`${reserva.id || reserva.numero_reserva || index}`}
                className={`reserva-card ${reserva.aprobacion || 'pendiente'} fade-in`}
              >
                <div className="reserva-header">
                  <div className="d-flex align-items-center">
                    <span className={`badge ${getAprobacionBadgeClass(reserva.aprobacion)} me-3`}>
                      {getEstadoTexto(reserva.aprobacion)}
                    </span>
                    <span className="text-muted">
                      #{reserva.numero_reserva}{reserva.fecha_creacion && (
                        <>
                          {' • '}
                          {new Date(reserva.fecha_creacion).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleShowModal(reserva)}
                      title="Ver detalles"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  </div>
                </div>
                
                <div className="reserva-body">
                  <div className="reserva-info">
                    <div className="info-group">
                      <div className="info-label">Evento</div>
                      <div className="info-value fw-bold">{reserva.evento?.nombre || 'Sin nombre'}</div>
                      <div className="text-muted small">
                        {reserva.evento?.tipo || 'Sin tipo'}
                      </div>
                    </div>
                    
                    <div className="info-group">
                      <div className="info-label">Fecha y Hora</div>
                      <div className="info-value">
                        {formatDate(reserva.evento?.fecha_hora || reserva.fecha_evento)}
                      </div>
                      <div className="mt-2">
                        <button
                          className={`btn btn-sm ${esAceptada ? 'btn-success' : 'btn-outline-success'} me-2`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAprobarReserva(reserva, 'aceptado');
                          }}
                          disabled={cargando || esAceptada}
                          title={esAceptada ? 'Reserva ya aceptada' : 'Aceptar reserva'}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          {esAceptada ? 'Aceptada' : 'Aceptar'}
                        </button>
                        <button
                          className={`btn btn-sm ${esRechazada ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAprobarReserva(reserva, 'rechazado');
                          }}
                          disabled={cargando || esRechazada}
                          title={esRechazada ? 'Reserva rechazada' : 'Rechazar reserva'}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          {esRechazada ? 'Rechazada' : 'Rechazar'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="info-group">
                      <div className="info-label">Personas</div>
                      <div className="info-value">{reserva.cantidad_personas || 'No especificado'}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Paginación */}
          {paginacion.totalPaginas > 1 && (
            <div className="paginacion-container">
              <div className="text-muted small">
                Mostrando {filtrarReservas().length} de {paginacion.totalItems} reservas
              </div>
              {renderPaginacion()}
            </div>
          )}
        </div>
      )}
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Modal de Detalle de Reserva */}
      {modalShow && reservaSeleccionada && (
        <React.Fragment>
          <div 
            className="modal-backdrop fade show"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1040,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              transition: 'opacity 0.15s linear'
            }}
            onClick={handleCloseModal}
          />
          <div 
            className="modal fade show d-block" 
            tabIndex="-1" 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1050,
              width: '100%',
              height: '100%',
              overflowX: 'hidden',
              overflowY: 'auto',
              outline: 0
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '800px' }}>
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              {/* Encabezado del Modal */}
              <div className="modal-header bg-primary text-white py-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar-check fs-4 me-2"></i>
                  <h5 className="modal-title mb-0 fw-bold">
                    Detalles de la Reserva <span className="text-warning">#{reservaSeleccionada.numero_reserva}</span>
                  </h5>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                  aria-label="Cerrar"
                ></button>
              </div>
              
              {/* Cuerpo del Modal */}
              <div className="modal-body p-0">
                <div className="row g-0">
                  {/* Sección de Información de la Reserva */}
                  <div className="col-md-6 p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle p-2 me-2">
                        <i className="bi bi-card-checklist text-primary fs-4"></i>
                      </div>
                      <h6 className="mb-0 fw-bold text-uppercase text-muted">Información de la Reserva</h6>
                    </div>
                    
                    <div className="ms-4">
                      <div className="d-flex align-items-start mb-3">
                        <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                        <div>
                          <span className="text-muted small">Estado</span>
                          <div>
                            <span className={`badge ${getAprobacionBadgeClass(reservaSeleccionada.aprobacion)} px-3 py-2`}>
                              <i className={`bi ${reservaSeleccionada.aprobacion === 'aceptado' ? 'bi-check-circle' : 
                                reservaSeleccionada.aprobacion === 'rechazado' ? 'bi-x-circle' : 'bi-hourglass-split'} me-2`}></i>
                              {getEstadoTexto(reservaSeleccionada.aprobacion)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-start mb-3">
                        <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                      <div>
                        <span className="text-muted small">Fecha de creación</span>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar3 me-2 text-primary"></i>
                          <span>
                            {reservaSeleccionada.createdAt
                              ? new Date(reservaSeleccionada.createdAt).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true
                                })
                              : 'No disponible'}
                          </span>
                        </div>
                      </div>
                      </div>
                      
                      <div className="d-flex align-items-start mb-3">
                        <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                        <div>
                          <span className="text-muted small">Cantidad de entradas</span>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-ticket-perforated me-2 text-primary"></i>
                            <span>{reservaSeleccionada.cantidad_entradas || 'No especificado'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {reservaSeleccionada.notas && (
                        <div className="d-flex align-items-start">
                          <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                          <div>
                            <span className="text-muted small">Notas adicionales</span>
                            <div className="bg-light p-3 rounded mt-1">
                              <i className="bi bi-chat-square-text text-muted me-2"></i>
                              {reservaSeleccionada.notas}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Sección de Información del Evento */}
                  <div className="col-md-6 bg-light p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white rounded-circle p-2 me-2">
                        <i className="bi bi-calendar-event text-primary fs-4"></i>
                      </div>
                      <h6 className="mb-0 fw-bold text-uppercase text-muted">Información del Evento</h6>
                    </div>
                    
                    {reservaSeleccionada.evento ? (
                      <div className="ms-4">
                        <div className="d-flex align-items-start mb-3">
                          <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                          <div>
                            <span className="text-muted small">Nombre del evento</span>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-tag me-2 text-primary"></i>
                              <span className="fw-medium">{reservaSeleccionada.evento.nombre || 'No especificado'}</span>
                            </div>
                          </div>
                        </div>
                        

                        <div className="d-flex align-items-start mb-3">
                          <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                          <div>
                            <span className="text-muted small">Fecha y hora</span>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-clock me-2 text-primary"></i>
                              <span>{formatDate(reservaSeleccionada.evento.fecha_hora || reservaSeleccionada.fecha_evento)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {reservaSeleccionada.evento.lugar?.nombre && (
                          <div className="d-flex align-items-start">
                            <i className="bi bi-circle-fill text-primary me-2 mt-1" style={{ fontSize: '0.5rem' }}></i>
                            <div>
                              <span className="text-muted small">Lugar</span>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt me-2 text-primary"></i>
                                <span>{reservaSeleccionada.evento.lugar.nombre}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="alert alert-warning mb-0" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        No hay información del evento disponible
                      </div>
                    )}
                    
                    {/* Información del Cliente */}
                    <div className="mt-4 pt-3 border-top">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-white rounded-circle p-2 me-2">
                          <i className="bi bi-person text-primary fs-4"></i>
                        </div>
                        <h6 className="mb-0 fw-bold text-uppercase text-muted">Información del Cliente</h6>
                      </div>
                      
                      {reservaSeleccionada.usuario ? (
                        <div className="ms-4">
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-person-circle me-2 text-primary"></i>
                            <span className="fw-medium">{reservaSeleccionada.usuario.nombre || 'Nombre no disponible'}</span>
                          </div>
                          
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-envelope me-2 text-primary"></i>
                            <a href={`mailto:${reservaSeleccionada.usuario.correo}`} className="text-decoration-none">
                              {reservaSeleccionada.usuario.correo || 'Correo no disponible'}
                            </a>
                          </div>
                          
                          {reservaSeleccionada.usuario.telefono && (
                            <div className="d-flex align-items-center">
                              <i className="bi bi-telephone me-2 text-primary"></i>
                              <a href={`tel:${reservaSeleccionada.usuario.telefono}`} className="text-decoration-none">
                                {reservaSeleccionada.usuario.telefono}
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="alert alert-warning mb-0" role="alert">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          No hay información del cliente disponible
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pie del Modal */}
              <div className="modal-footer bg-light d-flex justify-content-center">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary d-flex align-items-center" 
                  onClick={handleCloseModal}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
      )}
      </div>
    </div>
  );
};

export default Reservas;
