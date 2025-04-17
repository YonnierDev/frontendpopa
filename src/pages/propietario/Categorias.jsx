import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";  // Asegúrate de que 'api' esté configurado correctamente
import './Categorias.css';
import Sidebar from '../../components/Sidebar';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const token = localStorage.getItem('token');  // O desde un estado global si estás usando Redux

      // Asegúrate de incluir el token en la cabecera
      const response = await api.get('/propietario/categorias', {
        headers: {
          Authorization: `Bearer ${token}`  // Incluye el token en la cabecera
        }
      });

      console.log('Categorías cargadas:', response.data);
      setCategorias(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);

      if (error.response && error.response.status === 403) {
        setMensaje('No tienes permisos para acceder a esta información.');
      } else if (error.response && error.response.status === 404) {
        setMensaje('No se encontraron categorías.');
      } else {
        setMensaje('Error al cargar las categorías: ' + (error.response?.data?.message || error.message));
      }
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
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <div key={categoria.tipo} className="item-card">
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
              ))
            ) : (
              <p>No hay categorías disponibles para este propietario.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categorias;
