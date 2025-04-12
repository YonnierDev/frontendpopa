import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventos,
  createEvento,
  updateEvento,
  deleteEvento,
  toggleEstadoEvento,
} from "../../../store/eventos/eventosSlice";
import { fetchLugares } from "../../../store/lugares/lugaresSlice";
import "./EventosListPage.css";

const EventosListPage = () => {
  const dispatch = useDispatch();
  const { eventos, loading, error } = useSelector((state) => state.eventos);
  const { lugares } = useSelector((state) => state.lugares);

  const [formData, setFormData] = useState({
    nombre: "",
    lugarid: "",
    capacidad: "",
    precio: "",
    descripcion: "",
    fecha_hora: "",
  });

  const [editando, setEditando] = useState(false);
  const [eventoId, setEventoId] = useState(null);

  useEffect(() => {
    dispatch(fetchEventos());
    dispatch(fetchLugares());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      dispatch(updateEvento({ id: eventoId, evento: formData }));
    } else {
      dispatch(createEvento(formData));
    }
    setFormData({
      nombre: "",
      lugarid: "",
      capacidad: "",
      precio: "",
      descripcion: "",
      fecha_hora: "",
    });
    setEditando(false);
    setEventoId(null);
  };

  const handleEdit = (evento) => {
    setFormData({
      nombre: evento.nombre,
      lugarid: evento.lugarid,
      capacidad: evento.capacidad,
      precio: evento.precio,
      descripcion: evento.descripcion,
      fecha_hora: evento.fecha_hora,
    });
    setEditando(true);
    setEventoId(evento.id);
  };

  const getLugarNombre = (id) => {
    const lugar = lugares.find((l) => l.id === id);
    return lugar ? lugar.nombre : "Desconocido";
  };

  return (
    <div className="role-list-container">
      <h2 className="title">Gestión de Eventos</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <p>Cargando eventos...</p>}

      <form onSubmit={handleSubmit} className="create-role-form">
        <div className="form-grid">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del evento"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <select
            name="lugarid"
            value={formData.lugarid}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona Lugar</option>
            {lugares.map((l) => (
              <option key={l.id} value={l.id}>
                {l.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="capacidad"
            placeholder="Capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="fecha_hora"
            value={formData.fecha_hora}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editando ? "Actualizar" : "Crear"} Evento
        </button>
      </form>

      <table className="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lugar</th>
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Fecha y Hora</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id}>
              <td>{evento.id}</td>
              <td>{evento.nombre}</td>
              <td>{getLugarNombre(evento.lugarid)}</td>
              <td>{evento.capacidad}</td>
              <td>{evento.precio}</td>
              <td>{evento.fecha_hora}</td>
              <td>{evento.descripcion}</td>
              <td>{evento.estado ? "Activo" : "Inactivo"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEdit(evento)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => dispatch(deleteEvento(evento.id))}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() =>
                    dispatch(
                      toggleEstadoEvento({
                        id: evento.id,
                        estado: !evento.estado,
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

export default EventosListPage;
