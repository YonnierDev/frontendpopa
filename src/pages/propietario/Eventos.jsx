import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import './Eventos.css';

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

  useEffect(() => {
    cargarEventos();
    cargarLugares();
  }, []);

  const cargarEventos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/eventos");
      setEventos(Array.isArray(response.data.datos) ? response.data.datos : []);
      setMensaje('');
    } catch (error) {
      setMensaje('Error al cargar los eventos: ' + (error.response?.data?.mensaje || error.message));
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarLugares = async () => {
    try {
      const response = await api.get("/lugares");
      setLugares(Array.isArray(response.data.datos) ? response.data.datos : response.data);
    } catch (error) {
      setMensaje('Error al cargar los lugares: ' + (error.response?.data?.mensaje || error.message));
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
