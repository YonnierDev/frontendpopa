import { useState, useEffect } from "react";
import "./Calificaciones.css";

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Función para obtener calificaciones desde la API
  const fetchCalificaciones = async () => {
    try {
      const response = await fetch("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/calificaciones");
      if (!response.ok) throw new Error("Error al obtener las calificaciones");
      
      const data = await response.json();
      setCalificaciones(data);
    } catch (error) {
      console.error("Error al cargar calificaciones", error);
      setMensaje("No se pudieron cargar las calificaciones.");
    }
  };

  useEffect(() => {
    fetchCalificaciones();
  }, []);

  return (
    <div className="calificaciones-box">
      <h2>🍽 Carantanta</h2>
      <h3>⭐ Puntuaciones de Carantanta</h3>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {calificaciones.length === 0 ? (
        <p className="loading-text">Cargando...</p>
      ) : (
        <div className="card-container">
          {calificaciones.map((c) => (
            <div key={c.id} className="card">
              <p>
                <strong>Cliente:</strong> {c.usuario}
              </p>
              <p>
                <strong>Puntuación:</strong> ⭐ {c.puntuacion} / 5
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calificaciones;
