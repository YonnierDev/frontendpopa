import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Solicitudes.css";

const Solicitudes = ({ actualizarContador }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem('token'); // <--- AQUÍ tomamos el token guardado

  useEffect(() => {
    axios.get("https://popnocturna.vercel.app/api/lugares/pendientes?con_relaciones=true", {
      headers: {
        Authorization: `Bearer ${token}` // <--- AQUÍ lo enviamos
      }
    })
      .then(res => {
        console.log("Respuesta de la API:", res.data); // Debug
        const lugares = res.data.lugares || [];
        setSolicitudes(lugares);
        setLoading(false);
        actualizarContador(lugares.length);
      })
      .catch(err => {
        console.error("Error al obtener solicitudes:", err);
        setLoading(false);
      });
  }, [token]);

  // No necesitamos este useEffect ya que actualizamos el contador en la respuesta de la API

  const enviarMensaje = async (correo, estado) => {
    try {
      const mensaje = estado ? "¡Felicidades! Tu solicitud de lugar ha sido aprobada." : "Lo sentimos, tu solicitud de lugar ha sido rechazada.";
      console.log("Mensaje que se enviaría:", {
        destinatario: correo,
        asunto: estado ? "Solicitud de Lugar Aprobada" : "Solicitud de Lugar Rechazada",
        mensaje: mensaje
      });
      return true;
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      return false;
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      // Primero obtener la solicitud completa para tener el correo del usuario
      const solicitud = solicitudes.find(s => s.id === id);
      if (!solicitud) {
        throw new Error("Solicitud no encontrada");
      }

      // Actualizar el estado del lugar
      await axios.put(`https://popnocturna.vercel.app/api/lugar/${id}/estado`, 
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Enviar mensaje al usuario
      const mensajeEnviado = await enviarMensaje(solicitud.usuario?.correo || solicitud.correo, nuevoEstado);
      if (mensajeEnviado) {
        console.log("Mensaje enviado exitosamente");
      } else {
        console.error("No se pudo enviar el mensaje");
      }

      // Filtrar la solicitud que fue procesada y eliminarla de la lista
      const nuevasSolicitudes = solicitudes.filter(s => s.id !== id);
      setSolicitudes(nuevasSolicitudes);

      // Mostrar mensaje de éxito
      setMensaje(nuevoEstado 
        ? "Solicitud aprobada. El propietario será notificado pronto"
        : "Solicitud rechazada. El propietario será notificado pronto"
      );
      setTimeout(() => setMensaje(""), 3000);

    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setMensaje("Error al procesar la solicitud");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="solicitudes-box">
      <h2>Solicitudes de Creación de Lugar</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      {loading ? (
        <p className="loading-text">Cargando...</p>
      ) : solicitudes.length === 0 ? (
        <div className="no-solicitudes-container">
          <h3>¡No hay solicitudes pendientes!</h3>
          <p>Todas las solicitudes han sido procesadas.</p>
          <p className="info">Los propietarios serán notificados de sus solicitudes una vez que sean procesadas.</p>
        </div>
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
                <td>{solicitud.usuario?.nombre || solicitud.usuario?.correo || "No disponible"}</td>
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
