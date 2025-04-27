<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import defaultLogo from '../../assets/logos.png';
import Card from '../../components/home/Card';
import Buscador from '../../components/home/Buscador';
import Mapa from '../../components/home/Mapa';
import CategoriaBar from '../../components/home/CategoriaBar';
import DetallesLugar from '../../components/detalles/DetallesLugar';
import DetallesEvento from '../../components/detalles/DetallesEvento';
import DetallesCategoria from '../../components/detalles/DetallesCategoria';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorias } from '../../store/categorias/categoriasSlice';
import { fetchLugares } from '../../store/lugares/lugaresSlice';
import { fetchEventos } from '../../store/eventos/eventosSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Obtener datos del store
  const auth = useSelector(state => state.auth);
  const { categorias = [], loading: loadingCategorias } = useSelector(state => state.categorias);
  const { lugares = [] } = useSelector(state => state.lugares);
  const { eventos = [], loading: loadingEventos } = useSelector(state => state.eventos);
  
  // Estados locales
  const [showMapa, setShowMapa] = useState(false);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState('categorias');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Verificar permisos de usuario
  const checkUserPermission = (action) => {
    const protectedActions = ['comentar', 'calificar', 'reservar'];
    if (!protectedActions.includes(action)) return true;
    
    if (!auth?.isAuthenticated) {
      navigate('/login');
      return false;
    }
    
    if (auth?.user?.role !== 8) {
      alert('Solo los usuarios registrados pueden ' + action);
      return false;
    }
    
    return true;
  };

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchCategorias());
    dispatch(fetchLugares());
    dispatch(fetchEventos());
  }, [dispatch]);

  // Manejadores de eventos
  const handleItemClick = (item, tipo) => {
    setItemSeleccionado({ ...item, tipo });
    setMostrarDetalles(true);
  };

  const handleCloseDetalles = () => {
    setItemSeleccionado(null);
    setMostrarDetalles(false);
  };

  const handleBuscar = (filtros) => {
    setFiltrosActivos(true);
    const resultadosFiltrados = [];

    if (filtros.tipo === 'todos' || filtros.tipo === 'lugares') {
      const lugaresFiltrados = lugares.filter(lugar =>
        lugar.nombre.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        lugar.descripcion.toLowerCase().includes(filtros.texto.toLowerCase())
      );
      resultadosFiltrados.push(...lugaresFiltrados);
    }

    if (filtros.tipo === 'todos' || filtros.tipo === 'eventos') {
      const eventosFiltrados = eventos.filter(evento =>
        evento.nombre.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(filtros.texto.toLowerCase())
      );
      resultadosFiltrados.push(...eventosFiltrados);
    }

    setResultados(resultadosFiltrados);
    setFiltrosActivos(true);
  };

  return (
    <Container>
      <div className="py-4">
        <Buscador 
          onBuscar={handleBuscar} 
          onResetFiltros={() => {
            setFiltrosActivos(false);
            setResultados([]);
          }} 
        />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <CategoriaBar
            setSeccionSeleccionada={(seccion) => {
              setSeccionSeleccionada(seccion);
              setFiltrosActivos(false);
              setResultados([]);
            }}
            seccionSeleccionada={seccionSeleccionada}
            categorias={categorias}
            loading={loadingCategorias}
          />
          <Button 
            variant="primary" 
            onClick={() => setShowMapa(true)}
            className="d-flex align-items-center gap-2"
          >
            <FaMapMarkedAlt /> Ver en Mapa
          </Button>
        </div>

        {/* Modal de detalles */}
        {mostrarDetalles && itemSeleccionado && (
          itemSeleccionado.tipo === 'lugar' ? (
            <DetallesLugar lugar={itemSeleccionado} onClose={handleCloseDetalles} />
          ) : itemSeleccionado.tipo === 'evento' ? (
            <DetallesEvento evento={itemSeleccionado} onClose={handleCloseDetalles} />
          ) : (
            <DetallesCategoria 
              categoria={itemSeleccionado} 
              onClose={handleCloseDetalles}
            />
          )
        )}

        {/* Mostrar contenido principal */}
        {!mostrarDetalles && (
          <div className="mt-4">
            {filtrosActivos ? (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {resultados.length > 0 ? (
                  resultados.map((item, index) => (
                    <div className="col" key={index}>
                      <Card
                        item={item}
                        tipo={item.hasOwnProperty('fecha_evento') ? 'evento' : 'lugar'}
                        onClick={() => handleItemClick(item, item.hasOwnProperty('fecha_evento') ? 'evento' : 'lugar')}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center my-5">
                    <h4>No se encontraron resultados para tu búsqueda</h4>
                  </div>
                )}
              </div>
            ) : seccionSeleccionada === 'categorias' ? (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {categorias.map((categoria) => (
                  <div className="col" key={categoria.id}>
                    <Card 
                      item={categoria}
                      tipo="categoria"
                      onClick={() => handleItemClick(categoria, 'categoria')}
                    />
                  </div>
                ))}
              </div>
            ) : seccionSeleccionada === 'lugares' ? (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {lugares.map((lugar) => (
                  <div className="col" key={lugar.id}>
                    <Card 
                      item={lugar} 
                      tipo="lugar" 
                      onClick={() => handleItemClick(lugar, 'lugar')} 
                    />
                  </div>
                ))}
              </div>
            ) : seccionSeleccionada === 'eventos' ? (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {loadingEventos ? (
                  <div className="col-12 d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <img src={defaultLogo} alt="Cargando..." className="logo-cargando" />
                  </div>
                ) : (
                  eventos.map((evento) => (
                    <div className="col" key={evento.id}>
                      <Card 
                        item={evento} 
                        tipo="evento" 
                        onClick={() => handleItemClick(evento, 'evento')} 
                      />
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Mapa Modal */}
        <Mapa 
          show={showMapa} 
          onHide={() => setShowMapa(false)} 
          lugares={lugares}
        />
      </div>
    </Container>
  );
};

export default Home;
=======
// Archivo movido para organización
export { default } from '../Home.jsx';
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
