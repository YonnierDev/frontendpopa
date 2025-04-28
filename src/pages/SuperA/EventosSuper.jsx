import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaFilter, FaMoneyBill } from 'react-icons/fa';
import './styles/EventosSuper.css';

const EventosSuper = () => {
  const [eventos, setEventos] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    lugarid: '',
    capacidad: '',
    precio: '',
    estado: true
  });

  // Paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Verificar autenticación y rol al cargar el componente
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    console.log('=== Verificación de autenticación ===');
    console.log('Token:', token);
    console.log('Usuario:', usuario);

    if (!token) {
      console.error('No hay token en localStorage');
      setError('No hay token de autenticación');
      toast.error('No hay token de autenticación');
      return;
    }

    if (!usuario) {
      console.error('No hay usuario en localStorage');
      setError('No hay información de usuario');
      toast.error('No hay información de usuario');
      return;
    }

    // Verificar si el usuario tiene rol 1 o 2 (admin o super admin)
    if (usuario.rol !== 1 && usuario.rol !== 2) {
      console.error('Rol no permitido:', usuario.rol);
      setError('No tienes permisos para acceder a esta página');
      toast.error('No tienes permisos para acceder a esta página');
      return;
    }

    console.log('Autenticación exitosa, rol:', usuario.rol);
    fetchEventos();
    fetchLugares();
  }, [currentPage, fechaDesde, fechaHasta]);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      console.log('=== Inicio fetchEventos ===');
      console.log('Token:', token);
      console.log('Usuario:', usuario);

      if (!token) {
        console.error('No hay token en fetchEventos');
        setError('No hay token de autenticación');
        toast.error('No hay token de autenticación');
        return;
      }

      if (!usuario) {
        console.error('No hay usuario en fetchEventos');
        setError('No hay información de usuario');
        toast.error('No hay información de usuario');
        return;
      }

      // Verificar si el usuario tiene rol 1 o 2 (admin o super admin)
      if (usuario.rol !== 1 && usuario.rol !== 2) {
        console.error('Rol no permitido en fetchEventos:', usuario.rol);
        setError('No tienes permisos para acceder a esta página');
        toast.error('No tienes permisos para acceder a esta página');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(fechaDesde && { fechaDesde }),
        ...(fechaHasta && { fechaHasta })
      });

      console.log('Parámetros de búsqueda:', params.toString());

      // Configurar axios con el token por defecto
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.headers.common['Content-Type'] = 'application/json';

      console.log('Headers configurados:', axios.defaults.headers.common);

      const response = await axios.get(`https://popnocturna.vercel.app/api/eventos?${params}`);

      console.log('Respuesta del servidor:', response.data);

      if (response.data && response.data.datos) {
        setEventos(response.data.datos);
        const total = response.data.total || response.data.datos.length;
        setTotalPages(Math.ceil(total / 10));
      } else {
        console.error('Formato de respuesta inválido:', response.data);
        setError('Formato de respuesta inválido del servidor');
        toast.error('Error en el formato de respuesta del servidor');
      }
    } catch (error) {
      console.error('=== Error en fetchEventos ===');
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 401) {
        console.error('Error 401: Token inválido o expirado');
        setError('Sesión expirada o token inválido');
        toast.error('Sesión expirada o token inválido');
        // Opcional: redirigir al login
        // window.location.href = '/login';
      } else if (error.response?.status === 403) {
        console.error('Error 403: Permisos insuficientes');
        setError('No tienes permisos para acceder a esta página');
        toast.error('No tienes permisos para acceder a esta página');
      } else {
        console.error('Error general:', error.response?.data?.mensaje || 'Error desconocido');
        setError(error.response?.data?.mensaje || 'Error al cargar los eventos');
        toast.error(error.response?.data?.mensaje || 'Error al cargar los eventos');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLugares = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching lugares with token:', token);
      
      const response = await axios.get('https://popnocturna.vercel.app/api/lugares', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Lugares response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setLugares(response.data);
      } else {
        console.error('Formato de respuesta inválido para lugares:', response.data);
        toast.error('Error en el formato de respuesta de lugares');
      }
    } catch (error) {
      console.error('Error al cargar lugares:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.mensaje || 'Error al cargar los lugares');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEventos = eventos.filter(evento =>
    evento.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.lugar?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (evento) => {
    console.log('Editando evento:', evento); // Debug evento
    setSelectedEvento(evento);
    setFormData({
      nombre: evento.nombre || '',
      descripcion: evento.descripcion || '',
      fecha: evento.fecha_hora ? evento.fecha_hora.split('T')[0] : '',
      hora: evento.fecha_hora ? evento.fecha_hora.split('T')[1].substring(0, 5) : '',
      lugarid: evento.lugarid || '',
      capacidad: evento.capacidad || '',
      precio: evento.precio || '',
      estado: evento.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://popnocturna.vercel.app/api/evento/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Evento eliminado correctamente');
        fetchEventos();
      } catch (error) {
        console.error('Error al eliminar:', error); // Debug error
        toast.error(error.response?.data?.mensaje || 'Error al eliminar el evento');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const eventoData = {
        ...formData,
        fecha_hora: `${formData.fecha}T${formData.hora}`,
        usuarioid: JSON.parse(localStorage.getItem('usuario')).id
      };

      console.log('Enviando datos:', eventoData); // Debug datos

      if (selectedEvento) {
        await axios.put(`https://popnocturna.vercel.app/api/evento/${selectedEvento.id}`, eventoData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Evento actualizado correctamente');
      } else {
        await axios.post('https://popnocturna.vercel.app/api/evento', eventoData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Evento creado correctamente');
      }
      setShowModal(false);
      fetchEventos();
    } catch (error) {
      console.error('Error al guardar:', error); // Debug error
      toast.error(error.response?.data?.mensaje || 'Error al guardar el evento');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://popnocturna.vercel.app/api/evento/estado/${id}`, {
        estado: !estadoActual
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Estado del evento actualizado');
      fetchEventos();
    } catch (error) {
      console.error('Error al cambiar estado:', error); // Debug error
      toast.error(error.response?.data?.mensaje || 'Error al cambiar el estado del evento');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEventos();
  };

  if (loading) return <div className="super-loading">Cargando eventos...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="super-container">
      {error ? (
        <div className="super-alert super-alert-error">
          {error}
        </div>
      ) : (
        <>
          <div className="super-header">
            <h1 className="super-title">Gestión de Eventos</h1>
            <div className="super-header-actions">
              <button 
                className="super-btn super-btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
                data-tooltip="Filtros"
              >
                <FaFilter />
              </button>
              <button 
                className="super-btn super-btn-primary"
                onClick={() => {
                  setSelectedEvento(null);
                  setFormData({
                    nombre: '',
                    descripcion: '',
                    fecha: '',
                    hora: '',
                    lugarid: '',
                    capacidad: '',
                    precio: '',
                    estado: true
                  });
                  setShowModal(true);
                }}
                data-tooltip="Crear nuevo evento"
              >
                Nuevo Evento
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="super-filters">
              <form onSubmit={handleFilterSubmit} className="super-filter-form">
                <div className="form-group">
                  <label htmlFor="fechaDesde">Fecha Desde</label>
                  <input
                    type="date"
                    id="fechaDesde"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fechaHasta">Fecha Hasta</label>
                  <input
                    type="date"
                    id="fechaHasta"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>
                <button type="submit" className="super-btn super-btn-primary">
                  Aplicar Filtros
                </button>
        </form>
      </div>
          )}

          <div className="super-search-container">
            <div className="super-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="super-form-input"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="super-table-container">
            <table className="super-table">
          <thead>
            <tr>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Lugar</th>
              <th>Capacidad</th>
              <th>Precio</th>
                  <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
                {filteredEventos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="super-no-data">
                      No hay eventos disponibles
                    </td>
                  </tr>
                ) : (
                  filteredEventos.map(evento => (
                    <tr key={evento.id}>
                      <td>
                        <div className="evento-info">
                          <FaCalendarAlt className="evento-icon" />
                          {evento.nombre || 'Sin nombre'}
                        </div>
                      </td>
                      <td>
                        <div className="evento-fecha">
                          {evento.fecha_hora ? new Date(evento.fecha_hora).toLocaleDateString() : 'Sin fecha'}
                        </div>
                      </td>
                      <td>
                        <div className="evento-info">
                          <FaMapMarkerAlt className="evento-icon" />
                          {evento.lugar?.nombre || 'Sin lugar'}
                        </div>
                      </td>
                      <td>{evento.capacidad || 'Sin capacidad'}</td>
                      <td>
                        <div className="evento-info">
                          <FaMoneyBill className="evento-icon" />
                          ${evento.precio || '0'}
                        </div>
                  </td>
                  <td>
                        <div className="status-column">
                          <span className={`status-badge ${evento.estado ? 'active' : 'inactive'}`}>
                            {evento.estado ? 'Activo' : 'Inactivo'}
                          </span>
                          <label className="switch">
                      <input
                        type="checkbox"
                        checked={evento.estado}
                              onChange={() => handleToggleEstado(evento.id, evento.estado)}
                      />
                            <span className="slider"></span>
                    </label>
                        </div>
                      </td>
                      <td>
                        <div className="super-actions">
                          <button
                            className="super-btn super-btn-secondary"
                            onClick={() => handleEdit(evento)}
                            data-tooltip="Editar evento"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="super-btn super-btn-danger"
                            onClick={() => handleDelete(evento.id)}
                            data-tooltip="Eliminar evento"
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

          {totalPages > 1 && (
            <div className="super-pagination">
              <button
                className="super-btn super-btn-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="super-page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="super-btn super-btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}

          {showModal && (
            <div className="super-modal">
              <div className="super-modal-content">
                <h2>{selectedEvento ? 'Editar Evento' : 'Nuevo Evento'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fecha">Fecha</label>
                    <input
                      type="date"
                      id="fecha"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hora">Hora</label>
                    <input
                      type="time"
                      id="hora"
                      name="hora"
                      value={formData.hora}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lugarid">Lugar</label>
                    <select
                      id="lugarid"
                      name="lugarid"
                      value={formData.lugarid}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un lugar</option>
                      {lugares.map(lugar => (
                        <option key={lugar.id} value={lugar.id}>
                          {lugar.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="capacidad">Capacidad</label>
                    <input
                      type="number"
                      id="capacidad"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="precio">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      id="precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="estado"
                        checked={formData.estado}
                        onChange={handleChange}
                      />
                      Activo
                    </label>
                  </div>
                  <div className="super-modal-actions">
                    <button
                      type="button"
                      className="super-btn super-btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="super-btn super-btn-primary"
                    >
                      {selectedEvento ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventosSuper;
