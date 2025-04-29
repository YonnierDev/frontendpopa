import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Lugares.css";

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  //const [mensaje, setMensaje] = useState("");

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

  const cambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/lugar/estado/${id}`, {
        estado: nuevoEstado,
      });
      fetchLugares();
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
      {/*{mensaje && <p className="mensaje-exito">{mensaje}</p>}*/}

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
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={l.estado || false}
                      onChange={() => cambiarEstado(l.id, l.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                  <p>{l.estado ? "Activo" : "Inactivo"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lugares;
