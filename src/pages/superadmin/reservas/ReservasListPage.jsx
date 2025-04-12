import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReservas,
  createReserva,
  updateReserva,
  deleteReserva,
  toggleEstadoReserva,
} from "../../../store/reservas/reservasSlice";
import { fetchUsuarios } from "../../../store/usuarios/usuariosSlice";
import { fetchEventos } from "../../../store/eventos/eventosSlice";
import "./ReservasListPage.css";

const ReservasListPage = () => {
  const dispatch = useDispatch();
  const { reservas, loading, error } = useSelector((state) => state.reservas);
  const { usuarios } = useSelector((state) => state.usuarios);
  const { eventos } = useSelector((state) => state.eventos);

  const [formData, setFormData] = useState({
    usuarioid: "",
    eventoid: "",
    fecha_hora: "",
  });

  const [editando, setEditando] = useState(false);
  const [reservaId, setReservaId] = useState(null);

  useEffect(() => {
    dispatch(fetchReservas());
    dispatch(fetchUsuarios());
    dispatch(fetchEventos());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      dispatch(updateReserva({ id: reservaId, reserva: formData }));
    } else {
      dispatch(createReserva(formData));
    }
    setFormData({ usuarioid: "", eventoid: "", fecha_hora: "" });
    setEditando(false);
    setReservaId(null);
  };

  const handleEdit = (reserva) => {
    setFormData({
      usuarioid: reserva.usuarioid,
      eventoid: reserva.eventoid,
      fecha_hora: reserva.fecha_hora,
    });
    setEditando(true);
    setReservaId(reserva.id);
  };

  const getUsuarioNombre = (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    return usuario ? usuario.nombre : "Desconocido";
  };

  const getEventoNombre = (id) => {
    const evento = eventos.find((e) => e.id === id);
    return evento ? evento.nombre : "Desconocido";
  };

  return (
    <div className="role-list-container">
      <h2 className="title">Gestión de Reservas</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Cargando reservas...</p>}

      <form onSubmit={handleSubmit} className="create-role-form">
        <div className="form-grid">
          <select
            name="usuarioid"
            value={formData.usuarioid}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona Usuario</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
          <select
            name="eventoid"
            value={formData.eventoid}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona Evento</option>
            {eventos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="fecha_hora"
            value={formData.fecha_hora}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editando ? "Actualizar" : "Crear"} Reserva
        </button>
      </form>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Evento</th>
            <th>Fecha y Hora</th>
            <th>Aprobación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>{getUsuarioNombre(reserva.usuarioid)}</td>
              <td>{getEventoNombre(reserva.eventoid)}</td>
              <td>{reserva.fecha_hora}</td>
              <td>{reserva.aprobacion}</td>
              <td>{reserva.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <button className="btn btn-sm btn-warning" onClick={() => handleEdit(reserva)}>
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => dispatch(deleteReserva(reserva.id))}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() =>
                    dispatch(
                      toggleEstadoReserva({
                        id: reserva.id,
                        estado: !reserva.estado,
                      })
                    )
                  }
                >
                  Cambiar Estado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservasListPage;
