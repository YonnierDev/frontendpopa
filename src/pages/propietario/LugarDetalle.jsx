import React, { useState, useEffect, useRef } from 'react';
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
  FaUndo,
  FaChevronLeft,
  FaChevronRight
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const sliderRef = useRef(null);

  // Componentes personalizados para las flechas de navegación
  const NextArrow = ({ onClick }) => (
    <div 
      className="slick-arrow next-arrow" 
      onClick={onClick}
      style={{
        right: '25px',
        zIndex: 1
      }}
    >
      <FaChevronRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div 
      className="slick-arrow prev-arrow" 
      onClick={onClick}
      style={{
        left: '25px',
        zIndex: 1
      }}
    >
      <FaChevronLeft />
    </div>
  );

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (current, next) => setCurrentSlide(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div>
        <ul style={{ margin: '0px', padding: '10px 0' }}>{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: i === currentSlide ? '#ffcc00' : '#ccc',
          margin: '0 4px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      />
    )
  };

  // Función para abrir el lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  // Función para cerrar el lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto';
  };

  // Función para navegar en el lightbox
  const goToSlide = (index) => {
    setLightboxIndex(index);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  // Estado para eventos del lugar
  const [eventosLugar, setEventosLugar] = useState([]);
  
  // Obtener todas las imágenes del lugar (imagen principal + fotos adicionales)
  const allImages = lugar ? [
    lugar.imagen,
    ...(lugar.fotos_lugar || [])
  ].filter(Boolean) : [];

  // Navegación entre imágenes
  const nextImage = () => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario?.token) {
          navigate('/login');
          return;
        }
        
        // Usar el endpoint específico del propietario para obtener el lugar
        const lugarRes = await fetch(`https://popnocturna.vercel.app/api/propietario/lugares`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });
        
        if (!lugarRes.ok) {
          throw new Error(`Error al cargar el lugar: ${lugarRes.status}`);
        }
        
        const lugaresData = await lugarRes.json();
        // El endpoint ya devuelve solo los lugares del propietario
        const lugarEncontrado = Array.isArray(lugaresData) 
          ? lugaresData.find(l => l.id === parseInt(id))
          : null;
          
        if (!lugarEncontrado) {
          throw new Error('Lugar no encontrado o no tienes permisos para verlo');
        }
        
        setLugar(lugarEncontrado);
        // Cargar eventos del lugar específico
        const eventosRes = await fetch(`https://popnocturna.vercel.app/api/eventos?lugarId=${lugarEncontrado.id}`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (eventosRes.ok) {
          const eventosData = await eventosRes.json();
          // Asegurarse de que eventosData.datos es un array
          const eventosDelLugar = Array.isArray(eventosData.datos) ? eventosData.datos : [];
          setEventosLugar(eventosDelLugar);
        } else {
          const errorText = await eventosRes.text();
          console.error('Error al cargar eventos:', errorText);
          // Si hay un error, intentar con el endpoint alternativo
          try {
            const altEventosRes = await fetch('https://popnocturna.vercel.app/api/eventos', {
              headers: {
                'Authorization': `Bearer ${usuario.token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (altEventosRes.ok) {
              const eventosData = await altEventosRes.json();
              // Filtrar eventos por lugarId
              const eventosFiltrados = Array.isArray(eventosData.datos) 
                ? eventosData.datos.filter(evento => 
                    evento.lugar && parseInt(evento.lugar.id) === parseInt(lugarEncontrado.id)
                  )
                : [];
              setEventosLugar(eventosFiltrados);
            } else {
              throw new Error('Error al cargar eventos alternativos');
            }
          } catch (altError) {
            console.error('Error al cargar eventos alternativos:', altError);
            setEventosLugar([]);
          }
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
      <Sidebar lugarId={id} />
      <div className="content-container">
        <div className="imagen-ajuste">
          <div className="lugar-imagen-container" style={{position: 'relative'}}>
            <h3 className="lugar-detalle-place-title">{lugar?.nombre || 'Detalles del Lugar'}</h3>
            {allImages.length > 0 && (
              <div className="image-slider-container">
                <img 
                  src={allImages[currentSlide]} 
                  alt={`${lugar.nombre} - Imagen ${currentSlide + 1}`} 
                  style={imageSize} 
                />
                {allImages.length > 1 && (
                  <>
                    <button 
                      className="nav-arrow left-arrow" 
                      onClick={prevImage}
                      aria-label="Imagen anterior"
                    >
                      <FaChevronLeft />
                    </button>
                    <button 
                      className="nav-arrow right-arrow" 
                      onClick={nextImage}
                      aria-label="Siguiente imagen"
                    >
                      <FaChevronRight />
                    </button>
                    <div className="image-counter">
                      {currentSlide + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>
            )}
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
            {(() => {
              const usuario = JSON.parse(localStorage.getItem('usuario'));
              return (
                <>
                  <p>Nombre: {usuario?.nombre || 'No especificado'}</p>
                  <p>Correo: {usuario?.email || usuario?.correo || 'No especificado'}</p>
                </>
              );
            })()}
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