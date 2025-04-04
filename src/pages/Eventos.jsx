import { useState, useEffect } from "react"; 
import axios from "axios";
import "./Eventos.css";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevoEvento, setNuevoEvento] = useState({
    lugar: "",
    descripcion: "",
    precio: "",
    fecha_hora: "",
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get(
        "https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/eventos"
      );
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const handleChange = (e) => {
    setNuevoEvento({
      ...nuevoEvento,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrearEvento = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/evento",
        nuevoEvento
      );
      setMensaje("Evento creado exitosamente");
      fetchEventos();
      setNuevoEvento({ lugar: "", descripcion: "", precio: "", fecha_hora: "" });
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al crear evento", error);
      setMensaje("Error al crear el evento");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="eventos-contenedor">
      {/* Contenedor del formulario */}
      <div className="formulario-container">
        <h3>Crea un Evento</h3>
        <form onSubmit={handleCrearEvento}>
          <input
            type="text"
            name="lugar"
            placeholder="Lugar"
            value={nuevoEvento.lugar}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={nuevoEvento.descripcion}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={nuevoEvento.precio}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="fecha_hora"
            value={nuevoEvento.fecha_hora}
            onChange={handleChange}
            required
          />
          <button type="submit">Guardar</button>
        </form>
      </div>

      {/* Buscador de eventos */}
      <input
        type="text"
        placeholder="Buscar evento..."
        value={busqueda}
        onChange={handleBusqueda}
        className="buscador-eventos"
      />

      {/* Contenedor de la tabla */}
      <div className="tabla-container">
        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        {eventos.length === 0 ? (
          <p className="loading-text">Cargando...</p>
        ) : (
          <table className="eventos-tabla">
            <thead>
              <tr>
                <th>Nombre del Evento</th>
                <th>Propietario</th>
                <th>Capacidad</th>
                <th>Precio</th>
                <th>Fecha</th>
                <th>Acciones</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {eventos
                .filter((evento) =>
                  evento.descripcion.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((evento) => (
                  <tr key={evento.id} className="evento-item">
                    <td>{evento.descripcion}</td>
                    <td>{evento.propietario || "No disponible"}</td>
                    <td>{evento.capacidad}</td>
                    <td>${evento.precio}</td>
                    <td>{new Date(evento.fecha_hora).toLocaleString()}</td>
                    <td className="acciones">
                      <button className="detalles">Detalles</button>
                      <button className="editar">Editar</button>
                      <button className="eliminar">Eliminar</button>
                    </td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" checked={evento.estado} />
                        <span className="slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Eventos;
