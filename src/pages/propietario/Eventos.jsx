import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    fecha_hora: '',
    portada: []
  });
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [eventoEditar, setEventoEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lugarId = searchParams.get('lugarId');
  const [imagenModal, setImagenModal] = useState({
    mostrar: false,
    url: ''
  });

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
    
    // Si hay un lugarId en la URL, establecerlo como valor por defecto
    if (lugarId) {
      setNuevoEvento(prev => ({
        ...prev,
        lugarid: lugarId
      }));
    }
    
    // Si todo está bien, cargar los datos
    cargarEventos();
    cargarLugares();
  }, [navigate, lugarId]);

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
      // Cargar los lugares del propietario
      const lugaresResponse = await api.get('/api/propietario/lugares');
      const lugaresData = lugaresResponse.data;
      const lugaresIds = lugaresData.map(lugar => lugar.id);
      
      if (lugaresIds.length === 0) {
        setEventos([]);
        setMensaje('No tienes lugares registrados');
        return [];
      }
      
      // Obtener los eventos del propietario, incluyendo inactivos
      const eventosResponse = await api.get('/api/eventos', {
        params: { soloActivos: false }
      });
      
      let eventosFiltrados = [];
      
      // Filtrar los eventos que pertenecen al propietario
      if (eventosResponse.data.datos && Array.isArray(eventosResponse.data.datos)) {
        // Filtrar por lugares del propietario
        eventosFiltrados = eventosResponse.data.datos.filter(evento => {
          const eventoLugarId = evento.lugarid || (evento.lugar ? evento.lugar.id : null) || evento.lugarId;
          return eventoLugarId && lugaresIds.includes(parseInt(eventoLugarId, 10));
        });

        // Si hay un lugarId en la URL, filtrar por ese lugar específico
        if (lugarId) {
          const lugarIdNum = parseInt(lugarId, 10);
          console.log('Filtrando eventos para el lugar específico:', lugarIdNum);
          
          eventosFiltrados = eventosFiltrados.filter(evento => {
            const eventoLugarId = evento.lugarid || (evento.lugar ? evento.lugar.id : null) || evento.lugarId;
            const idLugarEvento = eventoLugarId ? parseInt(eventoLugarId, 10) : null;
            
            const incluir = idLugarEvento === lugarIdNum;
            
            console.log('Evento:', evento.id, 
                        'lugarId:', idLugarEvento, 
                        'tipo:', typeof idLugarEvento, 
                        'coincide con filtro:', incluir);
                        
            return incluir;
          });
        }
      }
      
      console.log('Eventos cargados y filtrados:', eventosFiltrados);
      
      // Actualizar el estado con los eventos filtrados
      setEventos(eventosFiltrados);
      setMensaje(eventosFiltrados.length === 0 ? 'No se encontraron eventos para este lugar' : '');
      
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
      const response = await api.get('/api/propietario/lugares');
      setLugares(Array.isArray(response.data) ? response.data : []);
      
      // Si hay un lugarId en la URL, seleccionarlo automáticamente
      if (lugarId) {
        const lugarSeleccionado = response.data.find(lugar => lugar.id === parseInt(lugarId, 10));
        if (lugarSeleccionado) {
          setNuevoEvento(prev => ({
            ...prev,
            lugarid: lugarSeleccionado.id
          }));
        }
      }
    } catch (error) {
      console.error('Error al cargar lugares:', error);
      setMensaje('Error al cargar los lugares: ' + (error.response?.data?.mensaje || error.message));
      setLugares([]);
    }
  };

  const cargarComentariosEvento = async (eventoId) => {
    try {
      const response = await api.get(`/api/evento/${eventoId}/comentarios`);
      setComentariosEvento(prev => ({ ...prev, [eventoId]: response.data.datos || [] }));
      setEventoComentariosAbierto(eventoId);
    } catch (error) {
      setMensaje('Error al cargar los comentarios: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usar el lugarId de la URL si está disponible, de lo contrario usar el seleccionado en el formulario
      const lugarIdFinal = lugarId || nuevoEvento.lugarid;
      
      if (!lugarIdFinal) {
        setMensaje('Debes seleccionar un lugar.');
        return;
      }
      
      // Validar que se hayan seleccionado imágenes
      if (imagenesSeleccionadas.length === 0) {
        setMensaje('Debes seleccionar al menos una imagen de portada');
        return;
      }
      
      const formData = new FormData();
      
      // Asegurarnos de que el lugarId sea un número
      const lugarIdNumero = parseInt(lugarIdFinal, 10);
      
      // Crear un objeto con todos los datos del evento
      const datosEvento = {
        nombre: nuevoEvento.nombre || '',
        descripcion: nuevoEvento.descripcion || '',
        capacidad: nuevoEvento.capacidad || '1',
        precio: nuevoEvento.precio || '0',
        fecha_hora: nuevoEvento.fecha_hora || new Date().toISOString(),
        lugarid: lugarIdNumero,
        estado: false // Los eventos nuevos se crean como inactivos por defecto
      };
      
      // Agregar cada campo individualmente al formData
      Object.entries(datosEvento).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      console.log('Datos del formulario a enviar:', {
        ...datosEvento,
        tipoLugarId: typeof lugarIdNumero,
        imagenes: `${imagenesSeleccionadas.length} imágenes`
      });
      
      // Agregar imágenes seleccionadas
      imagenesSeleccionadas.forEach((imagen) => {
        formData.append('portada', imagen);
      });
      
      // Configurar headers para FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      console.log('Enviando solicitud POST a /evento con datos:', {
        lugarid: lugarIdNumero,
        imagenes: imagenesSeleccionadas.length
      });
      
      // Usamos la ruta estándar para crear el evento
      const response = await api.post("/evento", formData, config);
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data && (response.data.mensaje === 'Evento creado correctamente' || response.data.datos)) {
        // Mostrar mensaje de éxito
        toast.success('Evento creado exitosamente. Está pendiente de aprobación.');
        
        // Limpiar el formulario
        setNuevoEvento({ 
          nombre: '', 
          lugarid: lugarId || '', 
          capacidad: '', 
          precio: '', 
          descripcion: '', 
          fecha_hora: ''
        });
        setImagenesSeleccionadas([]);
        
        // Cerrar el modal si está abierto
        setShowModal(false);
        const modal = document.getElementById('modalNuevoEvento');
        if (modal) {
          const modalBootstrap = bootstrap.Modal.getInstance(modal);
          if (modalBootstrap) modalBootstrap.hide();
        }
        
        // Recargar la lista de eventos
        await cargarEventos();
      } else {
        throw new Error(response.data?.mensaje || 'Error al crear el evento');
      }
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

  // Obtener el nombre del lugar si se está filtrando por uno específico
  const lugarActual = lugarId && lugares.length > 0 ? 
    lugares.find(l => l.id === parseInt(lugarId)) : null;

  const eliminarImagen = (index) => {
    const nuevasImagenes = [...imagenesSeleccionadas];
    nuevasImagenes.splice(index, 1);
    setImagenesSeleccionadas(nuevasImagenes);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar cantidad de imágenes (máximo 3)
    if (imagenesSeleccionadas.length + files.length > 3) {
      toast.error('Solo puedes subir un máximo de 3 imágenes');
      return;
    }
    
    // Validar tipos de archivo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    const archivosInvalidos = files.some(file => !tiposPermitidos.includes(file.type));
    
    if (archivosInvalidos) {
      toast.error('Solo se permiten imágenes en formato JPG, JPEG o PNG');
      return;
    }
    
    // Validar tamaño de archivo (máximo 5MB por imagen)
    const tamanoMaximo = 5 * 1024 * 1024; // 5MB
    const archivosDemasiadoGrandes = files.some(file => file.size > tamanoMaximo);
    
    if (archivosDemasiadoGrandes) {
      toast.error('Cada imagen debe pesar menos de 5MB');
      return;
    }
    
    // Si todo está bien, agregar las imágenes
    setImagenesSeleccionadas(prev => [...prev, ...files]);
    
    // Limpiar el input para permitir seleccionar la misma imagen otra vez
    e.target.value = null;
  };

  const verImagen = (url) => {
    setImagenModal({
      mostrar: true,
      url: url
    });
  };

  const cerrarModalImagen = () => {
    setImagenModal({
      mostrar: false,
      url: ''
    });
  };

  return (
    <>
      <Sidebar lugarId={lugarId} />
      <div className="app-container">
        <div className="main-content">
          <h2>
            {lugarActual 
              ? `Eventos de ${lugarActual.nombre}` 
              : 'Mis Eventos'}
          </h2>
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
            
            {/* Sección de carga de imágenes */}
            <div className="imagenes-portada">
              <label>Imágenes de portada (máx. 3):</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="input-imagen"
              />
              <div className="vista-previa">
                {imagenesSeleccionadas.map((imagen, index) => (
                  <div key={index} className="imagen-contenedor">
                    <img 
                      src={URL.createObjectURL(imagen)} 
                      alt={`Portada ${index + 1}`}
                      className="imagen-miniatura"
                    />
                    <button 
                      type="button" 
                      onClick={() => eliminarImagen(index)}
                      className="btn-eliminar-imagen"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
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
                        {/* Mostrar imágenes de portada si existen */}
                        {evento.portada && evento.portada.length > 0 && (
                          <div className="portada-preview">
                            <div className="portada-grid">
                              {evento.portada.slice(0, 3).map((imagen, idx) => (
                                <div 
                                  key={idx} 
                                  className="portada-item" 
                                  onClick={() => verImagen(imagen)}
                                >
                                  <img 
                                    src={imagen} 
                                    alt={`Portada ${idx + 1}`} 
                                    className="portada-imagen"
                                  />
                                  {evento.portada.length > 3 && idx === 2 && (
                                    <div className="mas-imagenes">+{evento.portada.length - 3}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <p>{evento.descripcion}</p>
                        <div className="item-details">
                          <span>Lugar: {evento.lugar?.nombre || 'No especificado'}</span>
                          <span>Fecha: {new Date(evento.fecha_hora).toLocaleString()}</span>
                          <span>Estado: 
                            <span className={`estado-badge ${evento.estado ? 'activo' : 'inactivo'}`}>
                              {evento.estado ? 'Activo' : 'Inactivo'}
                            </span>
                          </span>
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

      {/* Modal para ver imagen en tamaño completo */}
      {imagenModal.mostrar && (
        <div className="modal-imagen" onClick={cerrarModalImagen}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarModalImagen}>&times;</button>
            <img src={imagenModal.url} alt="Vista previa" className="imagen-completa" />
          </div>
        </div>
      )}
    </>
  );
};

export default Eventos;
