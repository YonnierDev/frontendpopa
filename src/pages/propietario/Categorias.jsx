import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import './Categorias.css';
import Sidebar from '../../components/Sidebar';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    setMensaje('');
    try {
      const token = localStorage.getItem('token');

      const response = await api.get('/propietario/categorias', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCategorias(response.data);
    } catch (error) {
      console.error("Error detallado:", error.response || error);
      const status = error.response?.status;
      const dataMsg = error.response?.data?.mensaje;
      if (status === 403) {
        setMensaje('No tienes permisos para acceder a esta información.');
      } else if (status === 404) {
        setMensaje(dataMsg || 'No se encontraron categorías.');
      } else {
        setMensaje(dataMsg || 'Error al cargar las categorías.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          {/* Contenedor del título */}
          <div className="titulo-container">
            <h2>Categorías y Negocios</h2>
          </div>

          {loading && <p>Cargando categorías...</p>}
          {mensaje && <div className="mensaje">{mensaje}</div>}

          {!loading && !mensaje && (
            categorias.length > 0 ? (
              <div className="items-list">
                {categorias.map((categoria, catIdx) => (
                  <div key={catIdx} className="item-card">
                    <div className="item-header">
                      <img
                        src={categoria.imagen}
                        alt={categoria.tipo}
                        className="categoria-imagen"
                      />
                      <div className="item-info">
                        <h3>{categoria.tipo}</h3>
                        <p>{categoria.descripcion}</p>
                      </div>
                    </div>

                    <div className="item-lugares">
                      {categoria.lugares.length > 0 ? (
                        categoria.lugares.map((lugar, idx) => (
                          <div key={idx} className="lugar-card">
                            <img
                              src={lugar.imagen}
                              alt={lugar.nombre}
                              className="lugar-imagen"
                            />
                            <div className="lugar-info">
                              <p><strong>Nombre:</strong> {lugar.nombre}</p>
                              <p><strong>Descripción:</strong> {lugar.descripcion}</p>
                              <p><strong>Ubicación:</strong> {lugar.ubicacion}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="sin-lugares">No hay negocios en esta categoría.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay categorías disponibles para este propietario.</p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Categorias;
