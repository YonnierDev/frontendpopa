import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import './Lugares.css';

const Lugares = () => {
  // Datos locales temporales
  const lugaresIniciales = [
    {
      id: 1,
      usuarioid: 1,
      categoriaid: 1,
      descripcion: "Restaurante italiano con terraza",
      ubicacion: "Calle Principal #123"
    },
    {
      id: 2,
      usuarioid: 1,
      categoriaid: 2,
      descripcion: "Parque central con área infantil",
      ubicacion: "Avenida Central #456"
    }
  ];

  const [lugares, setLugares] = useState(lugaresIniciales);
  const [nuevoLugar, setNuevoLugar] = useState({
    usuarioid: '',
    categoriaid: '',
    descripcion: '',
    ubicacion: ''
  });
  const [lugarEditar, setLugarEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (lugarEditar) {
        // Actualización local
        setLugares(lugares.map(lugar => 
          lugar.id === lugarEditar.id ? { ...lugar, ...nuevoLugar } : lugar
        ));
        setMensaje('Lugar actualizado exitosamente');
      } else {
        // Creación local
        const nuevoLugarConId = {
          ...nuevoLugar,
          id: lugares.length + 1
        };
        setLugares([...lugares, nuevoLugarConId]);
        setMensaje('Lugar creado exitosamente');
      }
      setNuevoLugar({
        usuarioid: '',
        categoriaid: '',
        descripcion: '',
        ubicacion: ''
      });
      setLugarEditar(null);
    } catch (error) {
      setMensaje('Error al procesar el lugar');
      console.error("Error:", error);
    }
  };

  const handleEditar = (lugar) => {
    setLugarEditar(lugar);
    setNuevoLugar({
      usuarioid: lugar.usuarioid,
      categoriaid: lugar.categoriaid,
      descripcion: lugar.descripcion,
      ubicacion: lugar.ubicacion
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este lugar?')) {
      try {
        // Eliminación local
        setLugares(lugares.filter(lugar => lugar.id !== id));
        setMensaje('Lugar eliminado exitosamente');
      } catch (error) {
        setMensaje('Error al eliminar el lugar');
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="lugares-container">
      <h2>Gestión de Lugares</h2>
      
      {mensaje && <div className="mensaje">{mensaje}</div>}

      <form onSubmit={handleSubmit} className="lugar-form">
        <input
          type="text"
          value={nuevoLugar.usuarioid}
          onChange={(e) => setNuevoLugar({...nuevoLugar, usuarioid: e.target.value})}
          placeholder="ID Usuario"
          required
        />
        <input
          type="text"
          value={nuevoLugar.categoriaid}
          onChange={(e) => setNuevoLugar({...nuevoLugar, categoriaid: e.target.value})}
          placeholder="ID Categoría"
          required
        />
        <textarea
          value={nuevoLugar.descripcion}
          onChange={(e) => setNuevoLugar({...nuevoLugar, descripcion: e.target.value})}
          placeholder="Descripción del lugar"
          required
        />
        <input
          type="text"
          value={nuevoLugar.ubicacion}
          onChange={(e) => setNuevoLugar({...nuevoLugar, ubicacion: e.target.value})}
          placeholder="Ubicación"
          required
        />
        <button type="submit">
          {lugarEditar ? 'Actualizar' : 'Crear'} Lugar
        </button>
      </form>

      <div className="lugares-lista">
        {lugares.map((lugar) => (
          <div key={lugar.id} className="lugar-item">
            <div className="lugar-info">
              <h3>📍 {lugar.ubicacion}</h3>
              <p>{lugar.descripcion}</p>
              <div className="lugar-detalles">
                <span>👤 Usuario ID: {lugar.usuarioid}</span>
                <span>🏷️ Categoría ID: {lugar.categoriaid}</span>
              </div>
            </div>
            <div className="lugar-botones">
              <button onClick={() => handleEditar(lugar)}>Editar</button>
              <button onClick={() => handleEliminar(lugar.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lugares; 