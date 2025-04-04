import { useState, useEffect } from "react";
import "./Eventos.css";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    lugarid: "",
    comentarioid: "",
    capacidad: "",
    precio: "",
    descripcion: "",
    fecha_hora: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    obtenerEventos();
  }, []);

  const obtenerEventos = async () => {
    try {
      const response = await fetch("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/eventos");
      if (!response.ok) throw new Error("Error al obtener los eventos");
      const data = await response.json();
      setEventos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoEvento({ ...nuevoEvento, [e.target.name]: e.target.value });
  };

  const handleCrearEvento = async () => {
    try {
      const response = await fetch("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEvento),
      });

      if (!response.ok) throw new Error("Error al crear el evento");
      setMensaje("Evento creado con éxito");
      setNuevoEvento({ lugarid: "", comentarioid: "", capacidad: "", precio: "", descripcion: "", fecha_hora: "" });
      obtenerEventos();
    } catch (error) {
      setMensaje("Error al crear el evento");
    }
  };

  const handleEditarEvento = async (id, nuevaDescripcion) => {
    try {
      const response = await fetch(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/evento/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descripcion: nuevaDescripcion }),
      });

      if (!response.ok) throw new Error("Error al actualizar el evento");
      setMensaje("Evento actualizado con éxito");
      obtenerEventos();
    } catch (error) {
      setMensaje("Error al actualizar el evento");
    }
  };

  const handleEliminarEvento = async (id) => {
    try {
      const response = await fetch(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/evento/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el evento");
      setMensaje("Evento eliminado con éxito");
      obtenerEventos();
    } catch (error) {
      setMensaje("Error al eliminar el evento");
    }
  };

  const handleAceptarEvento = (id) => {
    console.log(`Evento ${id} aceptado`); // Puedes hacer una actualización en la BD si es necesario
  };

  const handleRechazarEvento = (id) => {
    console.log(`Evento ${id} rechazado`); // Puedes hacer una actualización en la BD si es necesario
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString();
  };

  return (
    <div className="eventos-box">
      <h2>🎉 Eventos</h2>
      
      <div className="crear-evento-form">
        <input type="number" name="lugarid" value={nuevoEvento.lugarid} onChange={handleInputChange} placeholder="Lugar ID" />
        <input type="number" name="comentarioid" value={nuevoEvento.comentarioid} onChange={handleInputChange} placeholder="Comentario ID" />
        <input type="number" name="capacidad" value={nuevoEvento.capacidad} onChange={handleInputChange} placeholder="Capacidad" />
        <input type="number" name="precio" value={nuevoEvento.precio} onChange={handleInputChange} placeholder="Precio" />
        <input type="text" name="descripcion" value={nuevoEvento.descripcion} onChange={handleInputChange} placeholder="Descripción" />
        <input type="datetime-local" name="fecha_hora" value={nuevoEvento.fecha_hora} onChange={handleInputChange} />
        <button className="crear-evento" onClick={handleCrearEvento}>Crear Evento</button>
      </div>

      {mensaje && <p className="mensaje">{mensaje}</p>}
      
      {eventos.length === 0 ? (
        <p className="loading-text">Cargando...</p>
      ) : (
        <ul className="eventos-ul">
          {eventos.map((evento) => (
            <li key={evento.id} className="evento-item">
              <span>{evento.descripcion} - {formatearFecha(evento.fecha_hora)}</span>
              <button className="editar" onClick={() => handleEditarEvento(evento.id, prompt("Nueva descripción:", evento.descripcion))}>Editar</button>
              <button className="aceptar" onClick={() => handleAceptarEvento(evento.id)}>Aceptar</button>
              <button className="rechazar" onClick={() => handleRechazarEvento(evento.id)}>Rechazar</button>
              <button className="eliminar" onClick={() => handleEliminarEvento(evento.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Eventos;
