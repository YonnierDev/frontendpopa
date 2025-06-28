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

  // Componente de flecha de navegación simplificado
  const NavArrow = React.memo(({ direction, onClick }) => {
    const isLeft = direction === 'left';
    
    const handleClick = (e) => {
      // Prevenir el comportamiento por defecto
      e.preventDefault();
      e.stopPropagation();
      
      // Llamar al manejador original
      if (onClick) {
        onClick(e);
      }
    };
    
    const handleTouch = (e) => {
      // Prevenir el comportamiento táctil por defecto
      e.preventDefault();
      e.stopPropagation();
      
      // Llamar al manejador de clic
      handleClick(e);
    };
    
    return (
      <button
        type="button"
        onClick={handleClick}
        onTouchStart={handleTouch}
        aria-label={`${isLeft ? 'Anterior' : 'Siguiente'} imagen`}
        style={{
          position: 'absolute',
          [isLeft ? 'left' : 'right']: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          outline: 'none',
          padding: 0,
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          pointerEvents: 'auto',
          // Asegurar que el botón no tenga estilos por defecto
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          // Asegurar que el botón sea visible
          opacity: 1,
          // Asegurar que el botón sea interactivo
          touchAction: 'manipulation'
        }}
      >
        {isLeft ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
    );
  });
  
  NavArrow.displayName = 'NavArrow';

  // Función para abrir el lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setCurrentSlide(index); // Sincronizar el slide actual con el lightbox
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  // Función para cerrar el lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
    document.body.style.overflow = 'auto';
  };



  // Manejar teclado en el lightbox
  useEffect(() => {
    if (!showLightbox) return;

    const handleKeyDown = (e) => {
      if (!allImages || !allImages.length) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox, lightboxIndex, allImages?.length]);

  // Prevenir comportamiento por defecto en el contenedor del carrusel
  const handleSliderContainerClick = (e) => {
    // Solo prevenir el comportamiento por defecto si el clic es en el contenedor
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Navegación entre imágenes
  const navigateImage = React.useCallback((direction) => {
    return (e) => {
      if (e) {
        // Prevenir el comportamiento por defecto del navegador
        e.preventDefault();
        e.stopPropagation();
        
        // Prevenir el desplazamiento táctil
        if (e.type === 'touchstart') {
          e.stopImmediatePropagation();
        }
      }
      
      if (!allImages || !allImages.length) return;
      
      // Usar requestAnimationFrame para asegurar que el estado se actualice en el siguiente frame
      requestAnimationFrame(() => {
        setCurrentSlide(prev => {
          if (direction === 'next') {
            return (prev + 1) % allImages.length;
          } else {
            return (prev - 1 + allImages.length) % allImages.length;
          }
        });
      });
      
      // Devolver false para prevenir cualquier acción adicional
      return false;
    };
  }, [allImages]);
  
  const nextImage = navigateImage('next');
  const prevImage = navigateImage('prev');
  
  // Efecto para manejar el scroll al cambiar de imagen
  useEffect(() => {
    // No hacer nada si no hay imágenes o solo hay una
    if (!allImages || allImages.length <= 1) return;
    
    // Obtener el contenedor principal
    const container = document.querySelector('.image-slider-container');
    if (container) {
      // Hacer scroll suave al contenedor de la imagen
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentSlide, allImages]);

  // Navegación en el lightbox
  const goToNextImage = () => {
    if (!allImages || !allImages.length) return;
    const nextIndex = (lightboxIndex + 1) % allImages.length;
    setLightboxIndex(nextIndex);
    setCurrentSlide(nextIndex);
  };

  const goToPrevImage = () => {
    if (!allImages || !allImages.length) return;
    const prevIndex = (lightboxIndex - 1 + allImages.length) % allImages.length;
    setLightboxIndex(prevIndex);
    setCurrentSlide(prevIndex);
  };

  // Manejar gestos táctiles
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const diff = touchStartX - touchEndX;
    const swipeThreshold = 50; // Mínimo de píxeles para considerar un swipe
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToNextImage(); // Swipe izquierda
      } else {
        goToPrevImage(); // Swipe derecha
      }
    }
    
    // Resetear los valores
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Ordenar eventos por fecha (más recientes primero)
  const eventosLugar = React.useMemo(() => {
    if (!eventos || !eventos.length) return [];
    
    return [...eventos].sort((a, b) => 
      new Date(b.fecha_hora) - new Date(a.fecha_hora)
    );
  }, [eventos]);

  // Cargar datos del lugar y eventos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Cargar datos del lugar
        const lugarResponse = await api.get(`/api/lugar/${id}`);
        console.log('Datos completos del lugar recibidos:', lugarResponse);
        
        // Obtener las categorías disponibles
        const categoriasResponse = await api.get('/api/categorias');
        console.log('Categorías disponibles:', categoriasResponse.data);
        
        // Encontrar la categoría correspondiente
        const lugarConCategoria = {
          ...lugarResponse.data,
          categoria: categoriasResponse.data.find(cat => cat.id === lugarResponse.data.categoriaid)
        };
        
        console.log('Datos del lugar con categoría:', lugarConCategoria);
        setLugar(lugarConCategoria);
        
        // Cargar eventos del lugar específico (incluyendo inactivos)
        console.log('Solicitando eventos para el lugar ID:', id);
        const eventosResponse = await api.get('/api/eventos', {
          params: {
            lugarId: id,
            soloActivos: false
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
              <div 
                className="image-slider-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  // Deshabilitar el desplazamiento táctil en este contenedor
                  touchAction: 'none',
                  // Asegurar que el contenedor tenga un tamaño definido
                  minHeight: '300px',
                  // Asegurar que el contenedor sea un contexto de apilamiento
                  zIndex: 1
                }}
                // Prevenir el comportamiento de arrastre por defecto
                onDragStart={(e) => e.preventDefault()}
              >
                <div 
                  className="main-image-container"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(currentSlide);
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img 
                    src={allImages[currentSlide]} 
                    alt={`${lugar.nombre} - Imagen ${currentSlide + 1}`} 
                    style={imageSize}
                    className="main-image"
                  />
                </div>
                {allImages.length > 1 && (
                  <>
                    <NavArrow direction="left" onClick={prevImage} />
                    <NavArrow direction="right" onClick={nextImage} />
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
            <p>{
              lugar.categoria?.tipo || 
              (lugar.categoriaid ? `ID: ${lugar.categoriaid}` : 'No especificada')
            }</p>
            {lugar.categoriaid && !lugar.categoria?.tipo && (
              <p className="text-muted small">Detalles de la categoría no disponibles</p>
            )}
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
      
      {/* Lightbox */}
      {showLightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
              &times;
            </button>
            <div className="lightbox-image-container">
              <img 
                src={allImages[lightboxIndex]} 
                alt={`${lugar.nombre} - Imagen ${lightboxIndex + 1}`}
                className="lightbox-image"
              />
              <button 
                className="lightbox-nav prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevImage();
                }}
                aria-label="Imagen anterior"
              >
                <FaChevronLeft />
              </button>
              <button 
                className="lightbox-nav next" 
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                aria-label="Siguiente imagen"
              >
                <FaChevronRight />
              </button>
              <div className="lightbox-counter">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LugarDetalle;