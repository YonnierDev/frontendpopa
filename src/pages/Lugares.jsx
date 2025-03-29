import React, { useState, useEffect } from 'react';
import { api } from "./api/api";
import './Lugares.css';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [nuevoLugar, setNuevoLugar] = useState({
    usuarioid: '',
    categoriaid: '',
    descripcion: '',
    ubicacion: ''
  });
  const [lugarEditar, setLugarEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarLugares();
  }, []);

  const cargarLugares = async () => {
    try {
      const response = await api.get("/lugares");
      setLugares(response.data);
    } catch (error) {
      console.error("Error al cargar lugares:", error);
      setMensaje('Error al cargar los lugares');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (lugarEditar) {
        await api.put(`/lugares/${lugarEditar.id}`, nuevoLugar);
        setMensaje('Lugar actualizado exitosamente');
      } else {
        await api.post("/lugares", nuevoLugar);
        setMensaje('Lugar creado exitosamente');
      }
      setNuevoLugar({
        usuarioid: '',
        categoriaid: '',
        descripcion: '',
        ubicacion: ''
      });
      setLugarEditar(null);
      cargarLugares();
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
        await api.delete(`/lugares/${id}`);
        setMensaje('Lugar eliminado exitosamente');
        cargarLugares();
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