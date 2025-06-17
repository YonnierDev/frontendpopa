import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { api } from '../../components/api/api';
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
  FaChevronRight,
  FaCalendarAlt,
  FaTag,
  FaUsers
} from 'react-icons/fa';

const LugarDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [eventos, setEventos] = useState([]);
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

  // Obtener todas las imágenes del lugar (imagen principal + fotos adicionales)
  const allImages = React.useMemo(() => {
    if (!lugar) return [];
    return [
      lugar.imagen,
      ...(lugar.fotos_lugar || []).map(foto => 
        typeof foto === 'string' ? foto : foto.url || foto.imagen
      )
    ].filter(Boolean);
  }, [lugar]);

  // Ordenar eventos por fecha (más recientes primero)
  const eventosLugar = React.useMemo(() => {
    if (!eventos || !eventos.length) return [];
    
    return [...eventos].sort((a, b) => 
      new Date(b.fecha_hora) - new Date(a.fecha_hora)
    );
  }, [eventos]);

  // Navegación entre imágenes
  const nextImage = () => {
    setCurrentSlide(prev => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentSlide(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  // Cargar datos del lugar y eventos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar datos del lugar
        const lugarResponse = await api.get(`/lugar/${id}`);
        console.log('Datos del lugar recibidos:', lugarResponse.data);
        setLugar(lugarResponse.data);
        
        // Cargar eventos del lugar específico (incluyendo inactivos)
        console.log('Solicitando eventos para el lugar ID:', id);
        const eventosResponse = await api.get('/eventos', {
          params: {
            lugarId: id,
            soloActivos: false
          },
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        console.log('Respuesta completa de la API:', eventosResponse);
        console.log('Datos de eventos recibidos:', eventosResponse.data);
        
        // Verificar si la respuesta tiene la propiedad 'datos' con los eventos
        const eventosArray = Array.isArray(eventosResponse.data.datos) ? eventosResponse.data.datos : [];
        
        // Verificar si los eventos pertenecen al lugar correcto
        const eventosFiltrados = eventosArray.filter(evento => {
          const eventoLugarId = evento.lugarid || (evento.lugar && evento.lugar.id);
          const coincide = eventoLugarId == id; // Usar == para comparación flexible
          console.log(`Evento ID: ${evento.id}, Lugar ID: ${eventoLugarId}, Coincide: ${coincide}`);
          return coincide;
        });
        
        console.log(`Eventos para el lugar ${id}:`, eventosFiltrados);
        
        // Actualizar el estado con los eventos filtrados
        setEventos(eventosFiltrados);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setEventos([]);
        setError(error.message || 'Error al cargar los datos del lugar');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, [id, navigate]);

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
            <h2>Eventos</h2>
            {eventosLugar.length === 0 ? (
              <p>No hay eventos programados para este lugar.</p>
            ) : (
              <div className="eventos-lista">
                {eventosLugar.map((evento) => (
                  <div key={evento.id} className="evento-item">
                    <div className="evento-contenido">
                      <h3>{evento.nombre}</h3>
                      {evento.descripcion && (
                        <p className="evento-descripcion">{evento.descripcion}</p>
                      )}
                      <div className="evento-detalles">
                        <span className="evento-fecha">
                          <FaCalendarAlt className="icono-evento" />
                          {evento.fecha_hora ? new Date(evento.fecha_hora).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Sin fecha definida'}
                        </span>
                        {evento.precio && (
                          <span className="evento-precio">
                            <FaTag className="icono-evento" />
                            ${parseFloat(evento.precio).toLocaleString('es-CO')}
                          </span>
                        )}
                        {evento.capacidad && (
                          <span className="evento-capacidad">
                            <FaUsers className="icono-evento" />
                            {evento.capacidad} personas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LugarDetalle;