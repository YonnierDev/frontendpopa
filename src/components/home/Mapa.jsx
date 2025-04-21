
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLugares } from '../../store/lugares/lugaresSlice';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Modal, Button } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L from 'leaflet';
import axios from 'axios';

// Configuración de iconos para los marcadores
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Tu API Key de OpenCage
const API_KEY = '7d3ccad78ebd421fa588d0d2d9f4f8d0';

// Componente para hacer flyTo cuando se selecciona un lugar
const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17);
    }
  }, [position, map]);
  return null;
};

const Mapa = ({ show, onHide, lugares }) => {
  const modalStyle = {
    modal: {
      padding: '0',
      margin: '0',
      height: '100vh',
      width: '100vw',
      maxWidth: '100%'
    },
    modalDialog: {
      maxWidth: '98%',
      width: '98%',
      margin: '20px auto',
      height: 'calc(100vh - 40px)'
    },
    modalBody: {
      padding: '30px',
      height: 'calc(100vh - 140px)',
      backgroundColor: '#f8f9fa'
    }
  };

  const [lugaresConCoordenadas, setLugaresConCoordenadas] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerCoordenadas = async (lugar) => {
      try {
        const ubicacionCompleta = `${lugar.ubicacion}, Popayán, Cauca, Colombia`;
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(ubicacionCompleta)}&key=${API_KEY}&language=es&limit=1`
        );

        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry;
          return { ...lugar, lat, lng };
        }
        return null;
      } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        return null;
      }
    };

    const obtenerTodasLasCoordenadas = async () => {
      const lugaresConCoordenadas = await Promise.all(
        lugares.map(lugar => obtenerCoordenadas(lugar))
      );
      setLugaresConCoordenadas(lugaresConCoordenadas.filter(lugar => lugar !== null));
    };

    if (lugares?.length > 0) {
      obtenerTodasLasCoordenadas();
    }
  }, [lugares]);

  return (
    <Modal show={show} onHide={onHide} size="xl" style={modalStyle.modal} dialogClassName="modal-90w" centered>
      <div style={modalStyle.modalDialog}>
        <Modal.Header closeButton>
          <Modal.Title>Mapa de Lugares</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyle.modalBody}>
          <div className="map-container" style={{ height: '100%', width: '100%', margin: '0 auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <MapContainer
              center={[2.4448, -76.6147]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {lugaresConCoordenadas.map((lugar) => (
                <Marker
                  key={lugar.id}
                  position={[lugar.lat, lugar.lng]}
                  eventHandlers={{
                    click: () => setSelectedPosition([lugar.lat, lugar.lng])
                  }}
                >
                  <Popup>
                    <div className="popup-content">
                      <h3>{lugar.nombre}</h3>
                      <p>{lugar.descripcion}</p>
                      <p><strong>Dirección:</strong> {lugar.ubicacion}</p>
                      {lugar.horario && (
                        <p><strong>Horario:</strong> {lugar.horario}</p>
                      )}
                      {lugar.imagen && (
                        <img 
                          src={lugar.imagen} 
                          alt={lugar.nombre}
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {selectedPosition && <FlyToLocation position={selectedPosition} />}
            </MapContainer>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default Mapa;
