import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import './Categorias.css';
import Sidebar from '../../components/Sidebar';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const usuarioId = 3;  // Ejemplo de ID de propietario

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await api.get(`/propietario/${usuarioId}`);
      console.log('Categorías cargadas:', response.data);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      setMensaje('Error al cargar las categorías: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Categorías y Negocios</h2>
          
          {mensaje && <div className="mensaje">{mensaje}</div>}

          <div className="items-list">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="item-card">
                <div className="item-content">
                  <h3>{categoria.tipo}</h3>
                  <div className="item-lugares">
                    {categoria.lugares && categoria.lugares.length > 0 ? (
                      categoria.lugares.map((lugar, index) => (
                        <div key={index} className="lugar-card">
                          <p><strong>Nombre del negocio:</strong> {lugar.nombre}</p>
                          <p><strong>Descripción:</strong> {lugar.descripcion}</p>
                          <p><strong>Ubicación:</strong> {lugar.ubicacion}</p>
                        </div>
                      ))
                    ) : (
                      <p>No hay negocios asociados a esta categoría.</p>
                    )}
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

export default Categorias;
