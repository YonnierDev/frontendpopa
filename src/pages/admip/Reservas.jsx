import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Reservas.css";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

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
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.put(`https://popnocturna.vercel.app/api/reserva/${reservaSeleccionada.id}`, reservaSeleccionada);
      setMensaje("Reserva actualizada correctamente");
      fetchReservas();
      setReservaSeleccionada(null);
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
      await axios.put(`https://popnocturna.vercel.app/api/reserva/${id}`, {
        estado: nuevoEstado,
      });
      setReservas(reservas.map(reserva =>
        reserva.id === id ? { ...reserva, estado: nuevoEstado } : reserva
      ));
    } catch (error) {
      console.error("Error al cambiar estado de la reserva", error);
    }
  };

  const reservasFiltradas = reservas.filter(reserva =>
    reserva.aprobacion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="reservas-box">
      <div className="card-reservas">
        <h2>Reservas</h2>

        <input
          type="text"
          placeholder="Buscar reserva..."
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador-reservas"
        />

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        {reservas.length === 0 ? (
          <p className="loading-text">Cargando...</p>
        ) : (
          <table className="reservas-tabla">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>ID Evento</th>
                <th>Fecha</th>
                <th>Aprobación</th>
                <th>Acciones</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map(reserva => (
                <tr key={reserva.id} className="reserva-item">
                  <td>{reserva.usuarioid}</td>
                  <td>{reserva.eventoid}</td>
                  <td>{new Date(reserva.fecha_hora).toLocaleString()}</td>
                  <td>{reserva.aprobacion}</td>
                  <td className="acciones">
                    <button className="editar" onClick={() => handleEditar(reserva)}>Editar</button>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!reserva.estado}
                        onChange={() => toggleEstado(reserva.id, reserva.estado)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {reservaSeleccionada && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Editar Reserva</h3>
            <input
              type="number"
              value={reservaSeleccionada.usuarioid}
              onChange={(e) => setReservaSeleccionada({ ...reservaSeleccionada, usuarioid: e.target.value })}
              placeholder="ID Usuario"
            />
            <input
              type="number"
              value={reservaSeleccionada.eventoid}
              onChange={(e) => setReservaSeleccionada({ ...reservaSeleccionada, eventoid: e.target.value })}
              placeholder="ID Evento"
            />
            <input
              type="datetime-local"
              value={new Date(reservaSeleccionada.fecha_hora).toISOString().slice(0,16)}
              onChange={(e) => setReservaSeleccionada({ ...reservaSeleccionada, fecha_hora: e.target.value })}
            />
            <input
              type="text"
              value={reservaSeleccionada.aprobacion}
              onChange={(e) => setReservaSeleccionada({ ...reservaSeleccionada, aprobacion: e.target.value })}
              placeholder="Aprobación"
            />
            <button onClick={handleGuardarEdicion}>Guardar</button>
            <button className="cerrar-modal" onClick={() => setReservaSeleccionada(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservas;
