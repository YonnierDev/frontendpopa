import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import './Eventos.css';
import { toast } from 'react-toastify';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [comentariosEvento, setComentariosEvento] = useState({});
  const [eventoComentariosAbierto, setEventoComentariosAbierto] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [lugares, setLugares] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    lugarid: '',
    capacidad: '',
    precio: '',
    descripcion: '',
    fecha_hora: ''
  });
  const [eventoEditar, setEventoEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
    
    if (!usuario || !token) {
      console.log('No hay usuario o token, redirigiendo a login');
      toast.error('Debes iniciar sesión para acceder a esta página');
      navigate('/login');
      return;
    }
    
    // Verificar si el rol es el correcto
    if (parseInt(usuario.rol) !== 3) {
      console.log('Rol no autorizado, redirigiendo a login');
      toast.error('No tienes permiso para acceder a esta sección');
      navigate('/propietario/dashboard');
      return;
    }
    
    // Si todo está bien, cargar los datos
    cargarEventos();
    cargarLugares();
  }, [navigate]);

  useEffect(() => {
    function updateNavbarHeight() {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        document.documentElement.style.setProperty('--navbar-height', navbar.offsetHeight + 'px');
      }
    }
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  // Las funciones cargarEventos y cargarLugares se llaman desde el efecto de autenticación

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Usar el endpoint de eventos del propietario
      const response = await fetch('https://popnocturna.vercel.app/api/propietario/eventos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.mensaje || 'Error al cargar los eventos');
      }
      
      const data = await response.json();
      setEventos(Array.isArray(data) ? data : []);
      setMensaje('');
      
      return true;
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      setMensaje('Error al cargar los eventos: ' + error.message);
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarLugares = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (!usuario?.token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      const response = await fetch('https://popnocturna.vercel.app/api/propietario/lugares', {
        headers: {
          'Authorization': `Bearer ${usuario.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los lugares');
      }
      
      const data = await response.json();
      setLugares(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar lugares:', error);
      setMensaje('Error al cargar los lugares: ' + error.message);
      setLugares([]);
    }
  };

  const cargarComentariosEvento = async (eventoId) => {
    try {
      const response = await api.get(`/evento/${eventoId}/comentarios`);
      setComentariosEvento(prev => ({ ...prev, [eventoId]: response.data.datos || [] }));
      setEventoComentariosAbierto(eventoId);
    } catch (error) {
      setMensaje('Error al cargar los comentarios: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!nuevoEvento.lugarid) {
        setMensaje('Debes seleccionar un lugar.');
        return;
      }
      const eventoData = { ...nuevoEvento };
      if (eventoEditar) {
        await api.put(`/evento/${eventoEditar.id}`, eventoData);
        setMensaje('Evento actualizado exitosamente');
      } else {
        await api.post("/evento", eventoData);
        setMensaje('Evento creado exitosamente');
      }
      setNuevoEvento({ nombre: '', lugarid: '', capacidad: '', precio: '', descripcion: '', fecha_hora: '' });
      setEventoEditar(null);
      cargarEventos();
    } catch (error) {
      setMensaje('Error al procesar el evento: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const handleEditar = (evento) => {
    setEventoEditar(evento);
    setNuevoEvento({
      nombre: evento.nombre,
      lugarid: evento.lugarid || (evento.lugar && evento.lugar.id) || '',
      capacidad: evento.capacidad,
      precio: evento.precio,
      descripcion: evento.descripcion,
      fecha_hora: evento.fecha_hora ? evento.fecha_hora.slice(0, 16) : ''
    });
  };

  const handleEliminar = async (eventoId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    try {
      await api.delete(`/evento/${eventoId}`);
      setMensaje('Evento eliminado correctamente');
      cargarEventos();
    } catch (error) {
      setMensaje('Error al eliminar el evento: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  // Función para resaltar coincidencias en el nombre del evento
  const getNombreEventoResaltado = (nombre) => {
    const partes = busqueda
      ? nombre.split(new RegExp(`(${busqueda})`, 'gi'))
      : [nombre];
    return (
      <span>
        {partes.map((parte, idx) =>
          busqueda && parte.toLowerCase() === busqueda.toLowerCase()
            ? <span key={idx} className="resaltado-busqueda">{parte}</span>
            : <span key={idx}>{parte}</span>
        )}
      </span>
    );
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Mis Eventos</h2>
          {mensaje && <div className="mensaje">{mensaje}</div>}
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="text"
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                placeholder="Nombre del evento"
                required
              />
              <select
                value={nuevoEvento.lugarid}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugarid: e.target.value })}
                required
              >
                <option value="">Selecciona un lugar</option>
                {lugares.map((lugar) => (
                  <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                value={nuevoEvento.capacidad}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, capacidad: e.target.value })}
                placeholder="Capacidad"
                required
              />
              <input
                type="number"
                value={nuevoEvento.precio}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, precio: e.target.value })}
                placeholder="Precio"
                required
              />
            </div>
            <textarea
              value={nuevoEvento.descripcion}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
              placeholder="Descripción del evento"
              required
            />
            <input
              type="datetime-local"
              value={nuevoEvento.fecha_hora}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha_hora: e.target.value })}
              required
            />
            <button type="submit" className="btn-crear">
              {eventoEditar ? 'Actualizar' : 'Crear'} Evento
            </button>
            {eventoEditar && (
              <button type="button" onClick={() => { setEventoEditar(null); setNuevoEvento({ nombre: '', lugarid: '', capacidad: '', precio: '', descripcion: '', fecha_hora: '' }); }}>
                Cancelar
              </button>
            )}
          </form>
          {/* Filtros y búsqueda */}
          <div className="filtros-eventos">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={{ marginBottom: 0 }}>
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '2px', marginLeft: 0, display: 'block' }}>
                Estado: todos/activos/inactivos
              </span>
            </div>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              title="Fecha inicial"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              title="Fecha final"
            />
          </div>
          {loading ? (
            <div className="cargando">Cargando eventos...</div>
          ) : (
            <div className="items-list">
              {eventos
                .filter(evento => {
                  // Filtro por nombre
                  if (busqueda && !evento.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
                  // Filtro por estado
                  if (filtroEstado === 'activos' && !evento.estado) return false;
                  if (filtroEstado === 'inactivos' && evento.estado) return false;
                  // Filtro por fecha
                  if (fechaInicio && new Date(evento.fecha_hora) < new Date(fechaInicio)) return false;
                  if (fechaFin && new Date(evento.fecha_hora) > new Date(fechaFin + 'T23:59:59')) return false;
                  return true;
                })
                .length === 0 ? (
                <div className="sin-eventos">No hay eventos que coincidan con los filtros.</div>
              ) : (
                eventos
                  .filter(evento => {
                    if (busqueda && !evento.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
                    if (filtroEstado === 'activos' && !evento.estado) return false;
                    if (filtroEstado === 'inactivos' && evento.estado) return false;
                    if (fechaInicio && new Date(evento.fecha_hora) < new Date(fechaInicio)) return false;
                    if (fechaFin && new Date(evento.fecha_hora) > new Date(fechaFin + 'T23:59:59')) return false;
                    return true;
                  })
                  .map((evento) => (
                    <div key={evento.id} className={`item-card ${!evento.estado ? 'inactivo' : ''}`}>
                      <div className="item-header">
                        <strong>{getNombreEventoResaltado(evento.nombre)}</strong>
                        <span className={`estado-badge ${evento.estado ? 'activo' : 'inactivo'}`}>{evento.estado ? 'Activo' : 'Inactivo'}</span>
                        <span>{new Date(evento.fecha_hora).toLocaleString()}</span>
                      </div>
                      <div className="item-content">
                        <p>{evento.descripcion}</p>
                        <div className="item-details">
                          <span>💰 Precio: ${evento.precio}</span>
                          <span>👥 Capacidad: {evento.capacidad}</span>
                          <span>📍 Lugar: {evento.lugar?.nombre || 'Desconocido'}</span>
                        </div>
                      </div>
                      <div className="item-footer">
                        <button onClick={() => handleEditar(evento)} className="btn-editar">Editar</button>
                        <button onClick={() => handleEliminar(evento.id)} className="btn-eliminar">Eliminar</button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Eventos;
