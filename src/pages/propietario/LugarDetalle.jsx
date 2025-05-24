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



  // Estado para eventos del lugar
  const [eventosLugar, setEventosLugar] = useState([]);

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
    <div className="dashboard">
      <Sidebar />
      <div className="content-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{lugar?.nombre || 'Detalles del Lugar'}</h1>
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
        </div>
      </div>
    </div>
  );
};

export default LugarDetalle;