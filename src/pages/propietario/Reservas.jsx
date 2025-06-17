import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import { useNavigate, useLocation } from 'react-router-dom';
import './Reservas.css';
import Sidebar from '../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
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
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const estado = searchParams.get('estado') || '';
    const pagina = parseInt(searchParams.get('pagina') || '1', 10);
    
    setFiltros(prev => ({
      ...prev,
      estado,
      busqueda: searchParams.get('busqueda') || ''
    }));
    
    setPaginacion(prev => ({
      ...prev,
      pagina
    }));
    
    cargarReservas(pagina, estado, searchParams.get('busqueda'));
  }, [location.search]);

  const cargarReservas = async (pagina = 1, estado = '', busqueda = '') => {
    try {
      setCargando(true);
      const params = new URLSearchParams({
        page: pagina,
        limit: paginacion.limite,
        ...(estado && { estado }),
        ...(busqueda && { busqueda }),
        ...(filtros.fechaDesde && { fechaDesde: filtros.fechaDesde.toISOString().split('T')[0] }),
        ...(filtros.fechaHasta && { fechaHasta: filtros.fechaHasta.toISOString().split('T')[0] })
      });

      const response = await api.get(`/reservas?${params}`);
      
      // Si la respuesta tiene paginación (estilo mongoose-paginate-v2)
      const data = response.data.docs || response.data;
      setReservas(Array.isArray(data) ? data : []);
      
      if (response.data.totalPages) {
        setPaginacion(prev => ({
          ...prev,
          totalPaginas: response.data.totalPages,
          totalItems: response.data.totalDocs || response.data.total,
          pagina: response.data.page || pagina
        }));
      } else if (Array.isArray(response.data)) {
        // Si la respuesta es un array simple, manejamos la paginación en el frontend
        setPaginacion(prev => ({
          ...prev,
          totalItems: response.data.length,
          pagina: 1,
          totalPaginas: Math.ceil(response.data.length / prev.limite)
        }));
      }
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      toast.error(error.response?.data?.mensaje || 'Error al cargar las reservas');
    } finally {
      setCargando(false);
    }
  };

  const handleAprobarReserva = async (numeroReserva, aprobacion) => {
    try {
      await api.patch(`/reserva/aprobar/${numeroReserva}`, { 
        aprobacion: aprobacion.toLowerCase() 
      });
      
      toast.success(`Reserva ${aprobacion.toLowerCase()} correctamente`);
      cargarReservas(paginacion.pagina, filtros.estado, filtros.busqueda);
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      toast.error(error.response?.data?.mensaje || 'Error al actualizar el estado de la reserva');
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
          ‹
        </button>
        {paginas}
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => cambiarPagina(Math.min(totalPaginas, pagina + 1))}
          disabled={pagina === totalPaginas}
        >
          ›
        </button>
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => cambiarPagina(totalPaginas)}
          disabled={pagina === totalPaginas}
        >
          »
        </button>
      </div>
    );
  };

  const filtrarReservas = () => {
    if (!filtros.busqueda) return reservas;
    
    return reservas.filter(reserva => {
      const searchTerm = filtros.busqueda.toLowerCase();
      return (
        (reserva.usuario?.nombre || '').toLowerCase().includes(searchTerm) ||
        (reserva.evento?.nombre || '').toLowerCase().includes(searchTerm) ||
        (reserva.evento?.lugar?.nombre || '').toLowerCase().includes(searchTerm) ||
        (reserva.lugar?.nombre || '').toLowerCase().includes(searchTerm)
      );
    });
  };

  const getAprobacionBadgeClass = (aprobacion) => {
    switch (aprobacion.toLowerCase()) {
      case 'aceptado':
        return 'badge bg-success';
      case 'rechazado':
        return 'badge bg-danger';
      default:
        return 'badge bg-warning';
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="reservas-container">
      <Sidebar />
      <div className="content-container p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Gestión de Reservas</h1>
          <div className="d-flex align-items-center">
            <span className="badge bg-primary me-2">{paginacion.totalItems} reservas</span>
          </div>
        </div>
        
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">Filtros de búsqueda</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold">Búsqueda</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input
                    type="text"
                    name="busqueda"
                    className="form-control"
                    placeholder="Buscar por nombre o lugar..."
                    value={filtros.busqueda}
                    onChange={handleFiltroChange}
                    onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Estado</label>
                <select 
                  name="estado" 
                  className="form-select" 
                  value={filtros.estado}
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="aceptado">Aceptado</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Fecha desde</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                  <DatePicker
                    selected={filtros.fechaDesde}
                    onChange={(date) => handleFechaChange(date, 'fechaDesde')}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/aaaa"
                    isClearable
                  />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Fecha hasta</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar"></i></span>
                  <DatePicker
                    selected={filtros.fechaHasta}
                    onChange={(date) => handleFechaChange(date, 'fechaHasta')}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/aaaa"
                    minDate={filtros.fechaDesde}
                    isClearable
                  />
                </div>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <div className="d-flex w-100">
                  <button 
                    className="btn btn-primary me-2 flex-grow-1" 
                    onClick={aplicarFiltros}
                    title="Aplicar filtros"
                  >
                    <i className="bi bi-funnel"></i>
                  </button>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={limpiarFiltros}
                    title="Limpiar filtros"
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {cargando ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando reservas...</p>
          </div>
        ) : filtrarReservas().length === 0 ? (
          <div className="text-center py-5 my-5">
            <div className="mb-3">
              <i className="bi bi-calendar-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
            </div>
            <h4 className="text-muted">No se encontraron reservas</h4>
            <p className="text-muted">Intenta con otros filtros o crea una nueva reserva</p>
            <button className="btn btn-primary mt-2" onClick={limpiarFiltros}>
              <i className="bi bi-arrow-counterclockwise me-2"></i>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '120px' }}>Reserva</th>
                  <th>Cliente</th>
                  <th>Evento</th>
                  <th>Lugar</th>
                  <th>Fecha Evento</th>
                  <th>Estado</th>
                  <th className="text-end" style={{ width: '140px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarReservas().map((reserva) => {
                  const esPendiente = !reserva.aprobacion || reserva.aprobacion.toLowerCase() === 'pendiente';
                  const esAceptada = reserva.aprobacion?.toLowerCase() === 'aceptado';
                  const esRechazada = reserva.aprobacion?.toLowerCase() === 'rechazado';
                  
                  return (
                    <tr key={reserva.numero_reserva} className={esPendiente ? 'table-warning' : ''}>
                      <td>
                        <div className="fw-bold">#{reserva.numero_reserva}</div>
                        <small className="text-muted">
                          {formatDate(reserva.fecha_hora).split(',')[0]}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          <div>
                            <div className="fw-medium">{reserva.usuario?.nombre || 'Cliente'}</div>
                            <small className="text-muted text-truncate d-block" style={{ maxWidth: '150px' }}>
                              {reserva.usuario?.correo || ''}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{reserva.evento?.nombre || 'Evento'}</div>
                        <small className="text-muted">
                          {reserva.evento?.tipo || 'Sin tipo'}
                        </small>
                      </td>
                      <td>
                        {reserva.evento?.lugar?.nombre || reserva.lugar?.nombre || 'N/A'}
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-medium">
                            {formatDate(reserva.evento?.fecha_hora || reserva.fecha_evento).split(',')[0]}
                          </span>
                          <small className="text-muted">
                            {formatDate(reserva.evento?.fecha_hora || reserva.fecha_evento).split(',').slice(1).join(',').trim()}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getAprobacionBadgeClass(reserva.aprobacion)} text-capitalize`}>
                          {reserva.aprobacion || 'pendiente'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className={`btn btn-sm ${esAceptada ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleAprobarReserva(reserva.numero_reserva, 'aceptado')}
                            disabled={esAceptada}
                            title={esAceptada ? 'Reserva aceptada' : 'Aprobar reserva'}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${esRechazada ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleAprobarReserva(reserva.numero_reserva, 'rechazado')}
                            disabled={esRechazada}
                            title={esRechazada ? 'Reserva rechazada' : 'Rechazar reserva'}
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/reserva/${reserva.numero_reserva}`)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Paginación */}
        {paginacion.totalPaginas > 1 && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Mostrando {filtrarReservas().length} de {paginacion.totalItems} reservas
              </div>
              {renderPaginacion()}
            </div>
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
      </div>
    </div>
  );
};

export default Reservas;
