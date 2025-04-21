import React from 'react';
import {
  FaCity,
  FaCalendar,
  FaLayerGroup,
  FaCreditCard,
} from 'react-icons/fa';
import defaultLogo from '../../assets/logos.png';
import '../../App.css';

const secciones = [
  { tipo: 'Eventos', icono: <FaCalendar />, clave: 'eventos' },
  { tipo: 'Lugares', icono: <FaCity />, clave: 'lugares' },
  { tipo: 'Categorías', icono: <FaLayerGroup />, clave: 'categorias' },
  { tipo: 'Reservas', icono: <FaCreditCard />, clave: 'reservas' }
];

const CategoriaBar = ({ seccionSeleccionada, setSeccionSeleccionada, categorias = [], loading = false }) => {

  return (
    <div className="categoria-bar-container mb-4">
      <div className="d-flex justify-content-center mb-4">
        {secciones.map((sec) => (
          <div
            key={sec.clave}
            className={`categoria-item mx-3 text-center ${seccionSeleccionada === sec.clave ? 'activo' : ''}`}
            onClick={() => setSeccionSeleccionada(sec.clave)}
          >
            <div className="categoria-icon mb-2">{sec.icono}</div>
            <span className="categoria-nombre">{sec.tipo}</span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <img src={defaultLogo} alt="Cargando..." className="logo-cargando" style={{ width: '50px' }} />
        </div>
      )}
    </div>
  );
};

export default CategoriaBar;
