import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Solicitudes.css";

const Solicitudes = ({ actualizarContador }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token'); // <--- AQUÍ tomamos el token guardado

  useEffect(() => {
    axios.get("https://popnocturna.vercel.app/api/lugares/pendientes", {
      headers: {
        Authorization: `Bearer ${token}` // <--- AQUÍ lo enviamos
      }
    })
      .then(res => {
        setSolicitudes(res.data.lugares);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener solicitudes:", err);
        setLoading(false);
      });
  }, [token]);

  const actualizarEstado = (id, nuevoEstado) => {
    axios.put(`https://popnocturna.vercel.app/api/lugar/${id}/estado`, 
      { estado: nuevoEstado },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(() => {
      // Filtrar la solicitud que fue procesada y eliminarla de la lista
      setSolicitudes(prev => {
        const nuevasSolicitudes = prev.filter(s => s.id !== id); // Elimina la solicitud con el id correspondiente
        actualizarContador(nuevasSolicitudes.length); // Actualiza el contador en el Dashboard
        return nuevasSolicitudes;
      });
    })
    .catch(err => console.error("Error al actualizar estado:", err));
  };

  return (
    <div className="solicitudes-box">
      <h2>Solicitudes de Creación de Lugar</h2>
      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : solicitudes.length === 0 ? (
        <p className="no-solicitudes">No hay solicitudes pendientes</p>
      ) : (
        <table className="solicitudes-table">
          <thead>
            <tr>
              <th>Propietario</th>
              <th>Nombre del Lugar</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map(solicitud => (
              <tr key={solicitud.id}>
                <td>{solicitud.usuarioid}</td>
                <td>{solicitud.nombre}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.ubicacion}</td>
                <td>{solicitud.aprobacion ? "Activo" : "Inactivo"}</td>
                <td>
                  <button
                    className="aceptar"
                    onClick={() => actualizarEstado(solicitud.id, true)}
                  >
                    Aceptar
                  </button>
                  <button
                    className="rechazar"
                    onClick={() => actualizarEstado(solicitud.id, false)}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Solicitudes;
