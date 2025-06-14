import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../components/api/api';
import './Calificaciones.css';

const styles = {
  noCalificaciones: {
    textAlign: 'center',
    color: '#666',
    padding: '20px',
    fontSize: '1.2em'
  }
};
import Sidebar from '../../components/Sidebar';

const Calificaciones = () => {
  const { lugarid } = useParams();
  const [calificaciones, setCalificaciones] = useState([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.token) {
      setError('No se encontró la sesión del usuario');
      setCargando(false);
      return;
    }

    if (lugarid) {
      cargarCalificaciones();
    } else {
      setCargando(false);
    }
  }, [lugarid]);

  const cargarCalificaciones = async () => {
    try {
      setCargando(true);
      setError('');
      
      // Usa el lugarid de los parámetros de la URL
      const response = await api.get(`/calificaciones/lugar/${lugarid}`);
      const datos = response.data?.datos || {};
      const calificacionesArray = datos.calificaciones || [];
      
      setCalificaciones(calificacionesArray);
      setMensaje('');
    } catch (error) {
      console.error('Error al cargar calificaciones:', error.response || error);
      setCalificaciones([]);
      setError('Error al cargar las calificaciones. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  const calcularPromedio = () => {
    if (!calificaciones.length) return 0;
    const suma = calificaciones.reduce((acc, c) => acc + (c.puntuacion || 0), 0);
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

  if (cargando) {
    return (
      <div className="calificaciones-container">
        <Sidebar />
        <div className="calificaciones-content">
          <div className="loading-spinner"></div>
          <p>Cargando calificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calificaciones-container">
        <Sidebar />
        <div className="calificaciones-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!lugarid) {
    return (
      <div className="calificaciones-container">
        <Sidebar />
        <div className="calificaciones-content">
          <div className="info-message">
            <p>Selecciona un lugar para ver sus calificaciones</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calificaciones-container">
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Calificaciones de tus Eventos</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <p className="promedio-texto">
            Promedio de Calificaciones: <span className="estrellas">★</span> {calcularPromedio().toFixed(1)}
          </p>
          <p className="total-calificaciones">Total de calificaciones: {calificaciones.length}</p>

          {calificaciones.length === 0 ? (
            <p className="no-calificaciones">No hay calificaciones para este lugar</p>
          ) : (
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
                  <tr key={cal.id || cal.id_calificacion}>
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
          )}
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
    </div>
  );
};

export default Calificaciones;