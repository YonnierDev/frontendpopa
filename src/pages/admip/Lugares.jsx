import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Lugares.css";

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchLugares();
  }, []);

  const fetchLugares = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await axios.get("https://popnocturna.vercel.app/api/lugares", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLugares(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setLugares([]);
      } else {
        console.error("Error al cargar lugares", error);
      }
    }
  };

  const handleToggleEstado = async (lugar) => {
    const nuevoEstado = !lugar.estado;
    const originalLugares = [...lugares];

    setLugares(prevLugares =>
      prevLugares.map(l =>
        l.id === lugar.id ? { ...l, estado: nuevoEstado } : l
      )
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://popnocturna.vercel.app/api/lugar/estado/${lugar.id}`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // puedes agregar un toast aquí si ya lo usas
    } catch (error) {
      setLugares(originalLugares);
      console.error('Error al actualizar el estado del lugar.', error.response?.data || error.message);
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
                      onChange={() => handleToggleEstado(l)}
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
