import React, { useState, useEffect } from 'react';
import { FaCalendar, FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './styles/ReservasSuper.css';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevaReserva, setNuevaReserva] = useState({
    evento: "",
    usuario: "",
    cantidad: "",
    fecha: "",
    estado: "Activo"
  });

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/reservas");
      setReservas(response.data);
    } catch (error) {
      console.error("Error al cargar reservas", error);
    }
  };

  const handleEditar = (reserva) => {
    setReservaSeleccionada({ ...reserva });
    setModoEdicion(true);
    setNuevaReserva({
      evento: reserva.evento,
      usuario: reserva.usuario,
      cantidad: reserva.cantidad,
      fecha: reserva.fecha,
      estado: reserva.estado
    });
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/reserva/${reservaSeleccionada.id}`, reservaSeleccionada);
      setMensaje("Reserva actualizada correctamente");
      fetchReservas();
      setReservaSeleccionada(null);
      setModoEdicion(false);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al editar reserva", error);
      setMensaje("No se pudo editar la reserva");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/reserva/estado/${id}`, {
        estado: nuevoEstado,
      });
      setReservas(reservas.map(reserva =>
        reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
      ));
    } catch (error) {
      console.error("Error al cambiar estado de la reserva", error);
    }
  };

  const handleCrearReserva = (e) => {
    e.preventDefault();
    // Implementa la lógica para crear una nueva reserva
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaReserva({ ...nuevaReserva, [name]: value });
  };

  const confirmarReserva = (id) => {
    // Implementa la lógica para confirmar una reserva
  };

  const cancelarReserva = (id) => {
    // Implementa la lógica para cancelar una reserva
  };

  const cerrarModal = () => {
    setReservaSeleccionada(null);
    setModoEdicion(false);
  };

  const reservasFiltradas = reservas.filter(reserva =>
    reserva.evento.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="superadmin-reservas-contenedor">
      <div className="superadmin-reservas-formulario">
        <h2 className="superadmin-reservas-titulo">Reservas</h2>
        <div className="superadmin-reservas-formulario-titulo">
          <h3>{modoEdicion ? "Editar Reserva" : "Crear Reserva"}</h3>
        </div>
        <form onSubmit={handleCrearReserva} className="superadmin-reservas-form">
          <input type="text" name="evento" placeholder="Evento" value={nuevaReserva.evento} onChange={handleChange} required className="superadmin-reservas-input" />
          <input type="text" name="usuario" placeholder="Usuario" value={nuevaReserva.usuario} onChange={handleChange} required className="superadmin-reservas-input" />
          <input type="number" name="cantidad" placeholder="Cantidad" value={nuevaReserva.cantidad} onChange={handleChange} required className="superadmin-reservas-input" />
          <input type="datetime-local" name="fecha" value={nuevaReserva.fecha} onChange={handleChange} required className="superadmin-reservas-input" />
          <button type="submit" className="superadmin-reservas-submit">{modoEdicion ? "Actualizar" : "Guardar"}</button>
        </form>
      </div>

      <input type="text" placeholder="Buscar reserva..." value={busqueda} onChange={handleBusqueda} className="superadmin-reservas-buscador" />

      <div className="superadmin-reservas-tabla-container">
        {mensaje && <p className="superadmin-reservas-mensaje">{mensaje}</p>}

        <h3 className="superadmin-reservas-subtitulo">Lista de Reservas</h3>

        <table className="superadmin-reservas-tabla">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Usuario</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas
              .filter((reserva) => reserva.evento.toLowerCase().includes(busqueda.toLowerCase()))
              .map((reserva) => (
                <tr key={reserva.id} className="superadmin-reservas-fila">
                  <td>{reserva.evento}</td>
                  <td>{reserva.usuario}</td>
                  <td>{reserva.cantidad}</td>
                  <td>{new Date(reserva.fecha).toLocaleString()}</td>
                  <td>
                    <span className={`superadmin-reservas-estado superadmin-reservas-estado-${reserva.estado.toLowerCase()}`}>
                      {reserva.estado}
                    </span>
                  </td>
                  <td className="superadmin-reservas-acciones">
                    <button className="superadmin-reservas-confirmar" onClick={() => confirmarReserva(reserva.id)}>Confirmar</button>
                    <button className="superadmin-reservas-cancelar" onClick={() => cancelarReserva(reserva.id)}>Cancelar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {reservaSeleccionada && (
        <div className="superadmin-reservas-modal">
          <div className="superadmin-reservas-modal-contenido">
            <h3>Detalles de la Reserva</h3>
            <p><strong>Evento:</strong> {reservaSeleccionada.evento}</p>
            <p><strong>Usuario:</strong> {reservaSeleccionada.usuario}</p>
            <p><strong>Cantidad:</strong> {reservaSeleccionada.cantidad}</p>
            <p><strong>Fecha:</strong> {new Date(reservaSeleccionada.fecha).toLocaleString()}</p>
            <p><strong>Estado:</strong> {reservaSeleccionada.estado}</p>

            <button className="superadmin-reservas-cerrar-modal" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
