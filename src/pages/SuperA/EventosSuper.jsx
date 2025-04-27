import React, { useState, useEffect } from 'react';
import { FaCalendar, FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';
import './styles/EventosSuper.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nuevoEvento, setNuevoEvento] = useState({
    lugar: "",
    descripcion: "",
    precio: "",
    fecha_hora: "",
    capacidad: "",
    propietario: "",
    estado: true,
  });
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEventoEditar, setIdEventoEditar] = useState(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Error al cargar eventos", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEvento({ ...nuevoEvento, [name]: value });
  };

  const handleCrearEvento = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && idEventoEditar) {
        await axios.put(
          `https://popnocturna.vercel.app/api/evento/${idEventoEditar}`,
          {
            lugar: nuevoEvento.lugar,
            descripcion: nuevoEvento.descripcion,
            precio: parseFloat(nuevoEvento.precio),
            fecha_hora: nuevoEvento.fecha_hora,
            capacidad: nuevoEvento.capacidad || 0,
            propietario: nuevoEvento.propietario || "Admin",
            estado: nuevoEvento.estado !== false,
          }
        );
        setMensaje("Evento actualizado exitosamente");
      } else {
        await axios.post("https://popnocturna.vercel.app/api/evento", {
          lugar: nuevoEvento.lugar,
          descripcion: nuevoEvento.descripcion,
          precio: parseFloat(nuevoEvento.precio),
          fecha_hora: nuevoEvento.fecha_hora,
          capacidad: nuevoEvento.capacidad || 0,
          propietario: nuevoEvento.propietario || "Admin",
          estado: true,
        });
        setMensaje("Evento creado exitosamente");
      }

      fetchEventos();
      setNuevoEvento({
        lugar: "",
        descripcion: "",
        precio: "",
        fecha_hora: "",
        capacidad: "",
        propietario: "",
        estado: true,
      });
      setModoEdicion(false);
      setIdEventoEditar(null);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al guardar evento", error);
      setMensaje("Error al guardar el evento");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const iniciarEdicion = (evento) => {
    setNuevoEvento({
      lugar: evento.lugar,
      descripcion: evento.descripcion,
      precio: evento.precio,
      fecha_hora: evento.fecha_hora.slice(0, 16),
      capacidad: evento.capacidad,
      propietario: evento.propietario,
      estado: evento.estado,
    });
    setModoEdicion(true);
    setIdEventoEditar(evento.id);
    // window.scrollTo({ top: 0, behavior: "smooth" }); // Desactivado para evitar scroll global no deseado
  };

  const mostrarDetalles = async (evento) => {
    try {
      const response = await axios.get(
        `https://popnocturna.vercel.app/api/evento/${evento.id}`
      );
      setEventoSeleccionado(response.data);
    } catch (error) {
      console.error("Error al obtener detalles del evento", error);
    }
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };

  const cambiarEstadoEvento = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual;
      await axios.patch(`https://popnocturna.vercel.app/api/evento/estado/${id}`, {
        estado: nuevoEstado
      });

      setEventos(prev =>
        prev.map(evento =>
          evento.id === id ? { ...evento, estado: nuevoEstado } : evento
        )
      );
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al cambiar el estado", error);
      setMensaje("Error al cambiar el estado");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="superadmin-eventos-contenedor">
      <div className="superadmin-eventos-formulario">
        <h2 className="superadmin-eventos-titulo">Eventos</h2>
        <div className="superadmin-eventos-formulario-titulo">
          <h3>{modoEdicion ? "Editar Evento" : "Crea un Evento"}</h3>
        </div>
        <form onSubmit={handleCrearEvento} className="superadmin-eventos-form">
          <input type="text" name="lugar" placeholder="Lugar" value={nuevoEvento.lugar} onChange={handleChange} required className="superadmin-eventos-input" />
          <input type="text" name="descripcion" placeholder="Descripción" value={nuevoEvento.descripcion} onChange={handleChange} required className="superadmin-eventos-input" />
          <input type="number" name="precio" placeholder="Precio" value={nuevoEvento.precio} onChange={handleChange} required className="superadmin-eventos-input" />
          <input type="datetime-local" name="fecha_hora" value={nuevoEvento.fecha_hora} onChange={handleChange} required className="superadmin-eventos-input" />
          <input type="number" name="capacidad" placeholder="Capacidad" value={nuevoEvento.capacidad} onChange={handleChange} className="superadmin-eventos-input" />
          <input type="text" name="propietario" placeholder="Propietario" value={nuevoEvento.propietario} onChange={handleChange} className="superadmin-eventos-input" />
          <button type="submit" className="superadmin-eventos-submit">{modoEdicion ? "Actualizar" : "Guardar"}</button>
        </form>
      </div>

      <input type="text" placeholder="Buscar evento..." value={busqueda} onChange={handleBusqueda} className="superadmin-eventos-buscador" />

      <div className="superadmin-eventos-tabla-container">
        {mensaje && <p className="superadmin-eventos-mensaje">{mensaje}</p>}

        <h3 className="superadmin-eventos-subtitulo">Lista de Eventos</h3>

        <table className="superadmin-eventos-tabla">
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
              .filter((evento) => evento.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
              .map((evento) => (
                <tr key={evento.id} className="superadmin-eventos-fila">
                  <td>{evento.descripcion}</td>
                  <td>{evento.propietario || "No disponible"}</td>
                  <td>{evento.capacidad}</td>
                  <td>${evento.precio}</td>
                  <td>{new Date(evento.fecha_hora).toLocaleString()}</td>
                  <td className="superadmin-eventos-acciones">
                    <button className="superadmin-eventos-detalles" onClick={() => mostrarDetalles(evento)}>Detalles</button>
                    <button className="superadmin-eventos-editar" onClick={() => iniciarEdicion(evento)}>Editar</button>
                  </td>
                  <td>
                    <label className="superadmin-eventos-switch">
                      <input
                        type="checkbox"
                        checked={evento.estado}
                        onChange={() => cambiarEstadoEvento(evento.id, evento.estado)}
                      />
                      <span className="superadmin-eventos-slider"></span>
                    </label>
                    <div className="superadmin-eventos-estado">
                      {evento.estado ? "Activo" : "Inactivo"}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {eventoSeleccionado && (
        <div className="superadmin-eventos-modal">
          <div className="superadmin-eventos-modal-contenido">
            <h3>Detalles del Evento</h3>
            <p><strong>Descripción:</strong> {eventoSeleccionado.descripcion}</p>
            <p><strong>Lugar:</strong> {eventoSeleccionado.lugar}</p>
            <p><strong>Propietario:</strong> {eventoSeleccionado.propietario}</p>
            <p><strong>Capacidad:</strong> {eventoSeleccionado.capacidad}</p>
            <p><strong>Precio:</strong> ${eventoSeleccionado.precio}</p>
            <p><strong>Fecha:</strong> {new Date(eventoSeleccionado.fecha_hora).toLocaleString()}</p>

            <h5>Comentarios</h5>
            {eventoSeleccionado.comentarios?.length > 0 ? (
              <ul className="superadmin-eventos-comentarios">
                {eventoSeleccionado.comentarios.map((comentario) => (
                  <li key={comentario.id} className="superadmin-eventos-comentario">
                    <strong>{comentario.usuario}:</strong> {comentario.contenido}
                  </li>
                ))}
              </ul>
            ) : <p>No hay comentarios.</p>}

            <h5>Calificaciones</h5>
            {eventoSeleccionado.calificaciones?.length > 0 ? (
              <ul className="superadmin-eventos-calificaciones">
                {eventoSeleccionado.calificaciones.map((calificacion) => (
                  <li key={calificacion.id} className="superadmin-eventos-calificacion">
                    <strong>{calificacion.usuario}:</strong> {calificacion.puntuacion}
                  </li>
                ))}
              </ul>
            ) : <p>No hay calificaciones.</p>}

            <button className="superadmin-eventos-cerrar-modal" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Eventos;
