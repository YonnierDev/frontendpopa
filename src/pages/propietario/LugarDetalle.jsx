import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import './LugarDetalle.css';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaComment, 
  FaEdit,
  FaTrash,
  FaUser,
  FaWifi,
  FaParking,
  FaUtensils,
  FaMusic,
  FaCocktail,
  FaSmokingBan,
  FaPlus,
  FaMinus,
  FaUndo
} from 'react-icons/fa';

const LugarDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingImage, setEditingImage] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: '100%', height: 'auto' });
  const [tempImageSize, setTempImageSize] = useState({ width: '100%', height: 'auto' });
  const [editingSize, setEditingSize] = useState(false);

<<<<<<< HEAD
  // Estado para comentarios y calificaciones (simulado por ahora)
  const [comentarios] = useState([
    {
      id: 1,
      usuario: 'Juan Pérez',
      fecha: '2025-04-20',
      texto: 'Excelente lugar, muy buena atención',
      calificacion: 5
    },
    {
      id: 2,
      usuario: 'María López',
      fecha: '2025-04-19',
      texto: 'La música estaba muy buena, pero el servicio un poco lento',
      calificacion: 4
    }
  ]);
=======
  // Estado para comentarios reales
  const [comentarios, setComentarios] = useState([]);
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571

  const [calificaciones] = useState({
    promedio: 4.5,
    total: 50,
    detalles: [
      { estrellas: 5, cantidad: 30 },
      { estrellas: 4, cantidad: 15 },
      { estrellas: 3, cantidad: 3 },
      { estrellas: 2, cantidad: 1 },
      { estrellas: 1, cantidad: 1 }
    ]
  });

<<<<<<< HEAD
=======
  // Estado para eventos del lugar
  const [eventosLugar, setEventosLugar] = useState([]);

>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const lugaresRes = await fetch('https://popnocturna.vercel.app/api/lugares');
        if (!lugaresRes.ok) {
          throw new Error(`Error al cargar los lugares: ${lugaresRes.status}`);
        }
<<<<<<< HEAD

        const lugaresData = await lugaresRes.json();
        const lugarEncontrado = lugaresData.find(l => l.id === parseInt(id));
        
        if (!lugarEncontrado) {
          throw new Error('Lugar no encontrado');
        }

        setLugar(lugarEncontrado);
=======
        const lugaresData = await lugaresRes.json();
        const lugarEncontrado = lugaresData.find(l => l.id === parseInt(id));
        if (!lugarEncontrado) {
          throw new Error('Lugar no encontrado');
        }
        setLugar(lugarEncontrado);
        // Traer eventos del backend para este lugar
        const eventosRes = await fetch('https://popnocturna.vercel.app/api/public/eventos');
        if (eventosRes.ok) {
          const eventosData = await eventosRes.json();
          const eventosArray = eventosData.datos || [];
          // Filtrar eventos por el id del lugar anidado
          const eventosFiltrados = eventosArray.filter(ev => ev.lugar && Number(ev.lugar.id) === Number(lugarEncontrado.id));
          setEventosLugar(eventosFiltrados);
        } else {
          setEventosLugar([]);
        }
        // Traer comentarios reales de la API y filtrar por lugar o por evento perteneciente al lugar
        try {
          const usuario = JSON.parse(localStorage.getItem('usuario'));
          const comentariosRes = await fetch('https://popnocturna.vercel.app/api/comentarios', {
            headers: {
              'Authorization': `Bearer ${usuario?.token}`,
              'Content-Type': 'application/json'
            }
          });
          if (comentariosRes.ok) {
            const comentariosData = await comentariosRes.json();
            // Filtrar comentarios asociados directamente al lugar o a un evento del lugar
            const comentariosLugar = (comentariosData.comentarios || []).filter(com => {
              // Si el comentario tiene lugar directo
              if (com.lugar && Number(com.lugar.id) === Number(lugarEncontrado.id)) return true;
              // Si el comentario tiene evento y el evento tiene lugar
              if (com.evento && com.evento.lugar && Number(com.evento.lugar.id) === Number(lugarEncontrado.id)) return true;
              return false;
            });
            setComentarios(comentariosLugar);
          } else {
            setComentarios([]);
          }
        } catch (err) {
          setComentarios([]);
        }
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
<<<<<<< HEAD

=======
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
    cargarDatos();
  }, [id]);

  const handleImageSizeChange = (action) => {
    const currentWidth = parseInt(imageSize.width);
    let newWidth;

    switch (action) {
      case 'increase':
        newWidth = currentWidth + 10;
        break;
      case 'decrease':
        newWidth = Math.max(currentWidth - 10, 50);
        break;
      case 'reset':
        newWidth = 100;
        break;
      default:
        return;
    }

    setImageSize({ width: `${newWidth}%`, height: 'auto' });
  };

  const renderEstrellas = (cantidad) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < cantidad ? 'estrella' : 'estrella estrella-vacia'}
      />
    ));
  };

  if (loading) return <div className="lugar-detalle">Cargando...</div>;
  if (error) return <div className="lugar-detalle">Error: {error}</div>;
  if (!lugar) return <div className="lugar-detalle">No se encontró el lugar</div>;

<<<<<<< HEAD
=======
  console.log('Comentarios traídos para este lugar:', comentarios);
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
  return (
    <div className="lugar-detalle">
      <Sidebar />
      <div className="lugar-content">
        <div className="lugar-header">
          <div className="lugar-titulo">
            <h1>{lugar.nombre}</h1>
            <div className="lugar-ubicacion">
              <FaMapMarkerAlt /> {lugar.direccion}
            </div>
          </div>
        </div>

        <div className="imagen-ajuste">
          <div className="lugar-imagen-container">
            <img src={lugar.imagen} alt={lugar.nombre} style={imageSize} />
          </div>
          <div className="imagen-controles">
            <button onClick={() => handleImageSizeChange('decrease')}>
              <FaMinus /> Reducir
            </button>
            <button onClick={() => handleImageSizeChange('reset')}>
              <FaUndo /> Restablecer
            </button>
            <button onClick={() => handleImageSizeChange('increase')}>
              <FaPlus /> Aumentar
            </button>
          </div>
        </div>

        <div className="lugar-info-grid">
          <div className="info-card">
            <h2>Descripción</h2>
            <p>{lugar.descripcion}</p>
          </div>
          
          <div className="info-card">
            <h2>Categoría</h2>
            <p>{lugar.categoria?.tipo || 'No especificada'}</p>
          </div>

          <div className="info-card">
            <h2>Estado</h2>
            <p>{lugar.estado ? 'Activo' : 'Inactivo'}</p>
            <p>Aprobación: {lugar.aprobacion ? 'Aprobado' : 'Pendiente'}</p>
          </div>

          <div className="info-card">
            <h2>Propietario</h2>
            <p>Nombre: {lugar.usuario?.nombre || 'No especificado'}</p>
            <p>Correo: {lugar.usuario?.correo || 'No especificado'}</p>
          </div>

<<<<<<< HEAD
          {lugar.eventos && lugar.eventos.length > 0 && (
            <div className="info-card">
              <h2>Próximos Eventos</h2>
              {lugar.eventos.map((evento, index) => (
                <div key={index} className="evento-item">
                  <h3>{evento.nombre}</h3>
                  <p>{evento.descripcion}</p>
                  <p>Fecha: {new Date(evento.fecha_hora).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
=======
          <div className="info-card">
            <h2>Próximos Eventos</h2>
            {eventosLugar.length === 0 ? (
              <p>No hay próximos eventos para este lugar.</p>
            ) : (
              eventosLugar.map((evento, index) => (
                <div key={evento.id || index} className="evento-item">
                  <h3>{evento.nombre}</h3>
                  <p>{evento.descripcion}</p>
                  <p>Fecha: {evento.fecha_hora ? new Date(evento.fecha_hora).toLocaleDateString() : 'Sin fecha'}</p>
                </div>
              ))
            )}
          </div>
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
        </div>

        <div className="calificaciones-section">
          <h2>Calificaciones</h2>
          <div className="calificacion-promedio">
            <span className="calificacion-numero">{calificaciones.promedio}</span>
            <div className="calificacion-estrellas">
              {renderEstrellas(Math.round(calificaciones.promedio))}
            </div>
            <span>({calificaciones.total} calificaciones)</span>
          </div>
          <div className="calificacion-detalles">
            {calificaciones.detalles.map((detalle) => (
              <div key={detalle.estrellas} className="calificacion-barra">
                <span className="barra-numero">{detalle.estrellas}</span>
                <div className="barra-contenedor">
                  <div 
                    className="barra-progreso" 
                    style={{ width: `${(detalle.cantidad / calificaciones.total) * 100}%` }}
                  ></div>
                </div>
                <span className="barra-cantidad">{detalle.cantidad}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="comentarios-section">
          <div className="comentarios-header">
            <h2>Comentarios</h2>
          </div>
          
<<<<<<< HEAD
          {comentarios.map((comentario) => (
            <div key={comentario.id} className="comentario">
              <div className="comentario-header">
                <div className="comentario-usuario">
                  <div className="comentario-avatar">
                    <FaUser />
                  </div>
                  <div className="comentario-info">
                    <span className="comentario-nombre">{comentario.usuario}</span>
                    <span className="comentario-fecha">{comentario.fecha}</span>
                  </div>
                </div>
                <div className="calificacion-estrellas">
                  {renderEstrellas(comentario.calificacion)}
                </div>
              </div>
              <p className="comentario-texto">{comentario.texto}</p>
            </div>
          ))}
=======
          {comentarios.length === 0 ? (
            <p>No hay comentarios para este lugar.</p>
          ) : (
            comentarios.map((comentario) => (
              <div key={comentario.id} className="comentario">
                <div className="comentario-header">
                  <div className="comentario-usuario">
                    <div className="comentario-avatar">
                      <FaUser />
                    </div>
                    <div className="comentario-info">
                      <span className="comentario-nombre">{comentario.usuario?.nombre || 'Anónimo'}</span>
                      <span className="comentario-fecha">{comentario.fecha_hora ? new Date(comentario.fecha_hora).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                  <div className="calificacion-estrellas">
                    {renderEstrellas(comentario.calificacion || comentario.estrellas || 0)}
                  </div>
                </div>
                <p className="comentario-texto">{comentario.contenido}</p>
              </div>
            ))
          )}
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
        </div>
      </div>
    </div>
  );
};

export default LugarDetalle;