import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { FaStar, FaBuilding } from 'react-icons/fa';

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const API_URL = 'https://popnocturna.vercel.app/api';

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        const response = await fetch(`${API_URL}/propietario/calificaciones`, {
          headers: {
            'Authorization': `Bearer ${usuario.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar las calificaciones');
        }

        const data = await response.json();
        setCalificaciones(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, [usuario.token]);

  const renderStars = (cantidad) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < cantidad ? 'star-filled' : 'star-empty'}
      />
    ));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="calificaciones-container">
      <h1>Calificaciones</h1>

      <div className="calificaciones-grid">
        {calificaciones.map(calificacion => (
          <div key={calificacion.id} className="calificacion-card">
            <div className="calificacion-header">
              <FaBuilding className="icon" />
              <h3>{calificacion.lugar_nombre}</h3>
            </div>

            <div className="calificacion-info">
              <div className="calificacion-promedio">
                <p>Calificación Promedio</p>
                <div className="stars">
                  {renderStars(calificacion.promedio)}
                  <span className="promedio-valor">
                    {calificacion.promedio.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="calificacion-stats">
                <div className="stat">
                  <span>Total de Calificaciones</span>
                  <strong>{calificacion.total_calificaciones}</strong>
                </div>
                <div className="stat">
                  <span>Mejor Calificación</span>
                  <strong>{calificacion.mejor_calificacion}</strong>
                </div>
                <div className="stat">
                  <span>Peor Calificación</span>
                  <strong>{calificacion.peor_calificacion}</strong>
                </div>
              </div>

              <div className="calificacion-distribucion">
                <h4>Distribución de Calificaciones</h4>
                {[5, 4, 3, 2, 1].map(estrellas => (
                  <div key={estrellas} className="distribucion-row">
                    <div className="stars-label">
                      {renderStars(estrellas)}
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress"
                        style={{
                          width: `${(calificacion.distribucion[estrellas] || 0) * 100}%`
                        }}
                      />
                    </div>
                    <span className="cantidad">
                      {calificacion.distribucion[estrellas] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calificaciones;
=======
import { api } from '../../components/api/api';
import './Calificaciones.css';
import Sidebar from '../../components/Sidebar';

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCalificaciones();
  }, []);

  const cargarCalificaciones = async () => {
    try {
      const response = await api.get('/calificaciones');
      const datos = response.data?.datos || [];
      setCalificaciones(datos);
      setMensaje('');
    } catch (error) {
      console.error('Error al cargar calificaciones:', error.response || error);
      setMensaje(
        'Error al cargar las calificaciones: ' +
        (error.response?.data?.mensaje || error.message)
      );
    }
  };

  const calcularPromedio = () => {
    if (!calificaciones.length) return 0;
    const suma = calificaciones.reduce((acc, c) => acc + c.puntuacion, 0);
    return suma / calificaciones.length;
  };

  const verDetalle = async (id) => {
    try {
      const response = await api.get(`/calificacion/${id}`);
      const detalle = response.data?.datos || response.data;
      setDetalleSeleccionado(detalle);
      setMensaje('');
    } catch (error) {
      console.error('Error al obtener detalle:', error.response || error);
      setMensaje('Error al obtener el detalle de la calificación.');
    }
  };

  const cerrarDetalle = () => {
    setDetalleSeleccionado(null);
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Calificaciones de tus Eventos</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <p className="promedio-texto">
            Promedio de Calificaciones: <span className="estrellas">★</span> {calcularPromedio().toFixed(1)}
          </p>

          <table className="tabla-calificaciones">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Evento</th>
                <th>Calificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((cal) => (
                <tr key={cal.id}>
                  <td>{cal.usuario?.nombre || 'Desconocido'}</td>
                  <td>{cal.evento?.nombre || 'Evento eliminado'}</td>
                  <td>
                    <span className="estrellas">★</span> {cal.puntuacion}/5
                  </td>
                  <td>
                    <button onClick={() => verDetalle(cal.id)}>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detalleSeleccionado && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <h3>Detalle de Calificación</h3>

            <section>
              <h4>Usuario</h4>
              <p>Nombre: {detalleSeleccionado.usuario?.nombre || 'Desconocido'}</p>
              <p>Correo: {detalleSeleccionado.usuario?.correo || '-'}</p>
            </section>

            <section>
              <h4>Evento</h4>
              <p>Nombre: {detalleSeleccionado.evento?.nombre || 'Evento eliminado'}</p>
              <p>Descripción: {detalleSeleccionado.evento?.descripcion || 'No disponible'}</p>
            </section>

            <section>
              <h4>Calificación</h4>
              <p>
                <span className="estrellas">★</span> {detalleSeleccionado.puntuacion}/5
              </p>
              <p>Fecha: {new Date(detalleSeleccionado.createdAt).toLocaleString()}</p>
              {detalleSeleccionado.mensaje && (
                <div className="advertencia">
                 ⚠️ {detalleSeleccionado.mensaje}
                </div>
              )}
            </section>

            <button onClick={cerrarDetalle}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Calificaciones;
>>>>>>> 4c6738033daad045332ce1cc617753bbd4797571
