import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Comentarios.css";

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchComentarios();
  }, []);

  const fetchComentarios = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/comentarios");
      console.log("Comentarios recibidos:", response.data);
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const handleEditar = async (comentario) => {
    const nuevoContenido = prompt("Editar contenido del comentario:", comentario.contenido);
    if (nuevoContenido !== null && nuevoContenido.trim() !== "") {
      try {
        await axios.put(`https://popnocturna.vercel.app/api/comentario/${comentario.id}`, {
          contenido: nuevoContenido,
        });
        setComentarios(comentarios.map(c =>
          c.id === comentario.id ? { ...c, contenido: nuevoContenido } : c
        ));
      } catch (error) {
        console.error("Error al editar comentario:", error);
      }
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.put(`https://popnocturna.vercel.app/api/comentario/${id}/estado`, {
        activo: nuevoEstado,
      });
      setComentarios(comentarios.map(c =>
        c.id === id ? { ...c, activo: nuevoEstado } : c
      ));
    } catch (error) {
      console.error("Error al cambiar estado del comentario:", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const comentariosFiltrados = comentarios.filter(c =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="comentarios-box">
      <div className="card-comentarios">
        <h2>Comentarios</h2>
        <input
          type="text"
          placeholder="Buscar por nombre de usuario..."
          value={busqueda}
          onChange={handleBusqueda}
          className="buscador-comentarios"
        />

        <table className="comentarios-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Contenido</th>
              <th>Fecha</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {comentariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5">No hay comentarios disponibles.</td>
              </tr>
            ) : (
              comentariosFiltrados.map((c) => (
                <tr key={c.id} className="comentario-item">
                  <td>{c.nombre}</td>
                  <td>{c.contenido}</td>
                  <td>{new Date(c.fecha_hora).toLocaleString()}</td>
                  <td>
                    <button className="editar" onClick={() => handleEditar(c)}>Editar</button>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={c.activo}
                        onChange={() => toggleEstado(c.id, c.activo)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comentarios;
