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

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const lugaresRes = await fetch('https://popnocturna.vercel.app/api/lugares');
        if (!lugaresRes.ok) {
          throw new Error(`Error al cargar los lugares: ${lugaresRes.status}`);
        }

        const lugaresData = await lugaresRes.json();
        const lugarEncontrado = lugaresData.find(l => l.id === parseInt(id));
        
        if (!lugarEncontrado) {
          throw new Error('Lugar no encontrado');
        }

        setLugar(lugarEncontrado);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

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
        </div>
      </div>
    </div>
  );
};

export default LugarDetalle;