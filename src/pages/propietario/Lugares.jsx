import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import { useNavigate } from 'react-router-dom';
import './Lugares.css';
import Sidebar from '../../components/Sidebar';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [nuevoLugar, setNuevoLugar] = useState({
    categoriaid: '',
    usuarioid: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    estado: true
  });
  const [lugarEditar, setLugarEditar] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarLugares();
  }, []);

  const cargarLugares = async () => {
    try {
      const response = await api.get("/lugares");
      console.log('Lugares cargados:', response.data);
      setLugares(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar los lugares: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (lugarEditar) {
        await api.put(`/lugar/${lugarEditar.id}`, nuevoLugar);
        setMensaje('Lugar actualizado exitosamente');
      } else {
        await api.post("/lugar", nuevoLugar);
        setMensaje('Lugar creado exitosamente');
      }
      setNuevoLugar({
        categoriaid: '',
        usuarioid: '',
        nombre: '',
        descripcion: '',
        ubicacion: '',
        estado: true
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
      categoriaid: lugar.categoriaid,
      usuarioid: lugar.usuarioid,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      ubicacion: lugar.ubicacion,
      estado: lugar.estado
    });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este lugar?')) {
      try {
        await api.delete(`/lugar/${id}`);
        setMensaje('Lugar eliminado exitosamente');
        cargarLugares();
      } catch (error) {
        setMensaje('Error al eliminar el lugar');
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="header">
          <button className="cerrar-sesion" onClick={() => navigate('/login')}>
            Cerrar sesión
          </button>
        </div>

        <div className="main-content">
          <h2>Lugares de Popayán Nocturna</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="number"
                value={nuevoLugar.categoriaid}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, categoriaid: e.target.value })}
                placeholder="ID Categoría"
                required
              />
              <input
                type="number"
                value={nuevoLugar.usuarioid}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, usuarioid: e.target.value })}
                placeholder="ID Usuario"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={nuevoLugar.nombre}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, nombre: e.target.value })}
                placeholder="Nombre del lugar"
                required
              />
              <input
                type="text"
                value={nuevoLugar.ubicacion}
                onChange={(e) => setNuevoLugar({ ...nuevoLugar, ubicacion: e.target.value })}
                placeholder="Ubicación"
                required
              />
            </div>
            <textarea
              value={nuevoLugar.descripcion}
              onChange={(e) => setNuevoLugar({ ...nuevoLugar, descripcion: e.target.value })}
              placeholder="Descripción del lugar"
              required
            />
            <button type="submit" className="btn-crear">
              {lugarEditar ? 'Actualizar' : 'Crear'} Lugar
            </button>
          </form>

          <div className="items-list">
            {lugares.map((lugar) => (
              <div key={lugar.id} className="item-card">
                <div className="item-header">
                  <h3>{lugar.nombre}</h3>
                  <span className="estado-badge">
                    {lugar.estado ? '🟢 Activo' : '🔴 Inactivo'}
                  </span>
                </div>
                <div className="item-content">
                  <p><strong>📍 Ubicación:</strong> {lugar.ubicacion}</p>
                  <p>{lugar.descripcion}</p>
                  <div className="item-details">
                    <span>👤 Usuario ID: {lugar.usuarioid}</span>
                    <span>🏷️ Categoría ID: {lugar.categoriaid}</span>
                  </div>
                </div>
                <div className="item-footer">
                  <span>Actualizado: {new Date(lugar.updatedAt).toLocaleDateString()}</span>
                  <div className="item-actions">
                    <button onClick={() => handleEditar(lugar)}>Editar</button>
                    <button onClick={() => handleEliminar(lugar.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Lugares;
