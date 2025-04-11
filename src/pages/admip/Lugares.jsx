import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Lugares.css";

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);

  useEffect(() => {
    fetchLugares();
  }, []);

  const fetchLugares = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/lugares");
      setLugares(response.data);
    } catch (error) {
      console.error("Error al cargar lugares", error);
    }
  };

  const handleEditar = (lugar) => {
    setLugarSeleccionado(lugar);
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.put(
        `https://popnocturna.vercel.app/api/lugar/${lugarSeleccionado.id}`,
        lugarSeleccionado
      );
      setMensaje("Lugar actualizado correctamente");
      fetchLugares();
      setLugarSeleccionado(null);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar el lugar", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.put(`https://popnocturna.vercel.app/api/lugar/${id}/estado`, {
        activo: nuevoEstado,
      });
      setLugares(lugares.map(l => (l.id === id ? { ...l, activo: nuevoEstado } : l)));
    } catch (error) {
      console.error("Error al cambiar estado del lugar", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const lugaresFiltrados = lugares.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="lugares-box">
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      <div className="card-lugares card-formulario">
        <h2>Lugares</h2>

        <input
          type="text"
          placeholder="Buscar lugar..."
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador-lugares"
        />

        <table className="lugares-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Descripción</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {lugaresFiltrados.map((l) => (
              <tr key={l.id} className="lugar-item">
                <td>{l.nombre}</td>
                <td>{l.ubicacion}</td>
                <td>{l.descripcion || "Sin descripción"}</td>
                <td>
                  <button className="editar" onClick={() => handleEditar(l)}>Editar</button>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={l.activo}
                      onChange={() => toggleEstado(l.id, l.activo)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lugarSeleccionado && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Editar Lugar</h3>
            <input
              type="text"
              value={lugarSeleccionado.nombre}
              onChange={(e) =>
                setLugarSeleccionado({ ...lugarSeleccionado, nombre: e.target.value })
              }
            />
            <input
              type="text"
              value={lugarSeleccionado.ubicacion}
              onChange={(e) =>
                setLugarSeleccionado({ ...lugarSeleccionado, ubicacion: e.target.value })
              }
            />
            <textarea
              value={lugarSeleccionado.descripcion}
              onChange={(e) =>
                setLugarSeleccionado({ ...lugarSeleccionado, descripcion: e.target.value })
              }
            />
            <button onClick={handleGuardarEdicion}>Guardar</button>
            <button className="cerrar-modal" onClick={() => setLugarSeleccionado(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lugares;
