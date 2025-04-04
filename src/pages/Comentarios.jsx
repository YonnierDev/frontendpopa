import { useState, useEffect } from "react";
import axios from "axios";
import "./Comentarios.css";

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetchComentarios();
  }, []);

  const fetchComentarios = async () => {
    try {
      const response = await axios.get("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/comentarios");
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const handleEditar = (comentario) => {
    alert(`Función para editar comentario con id ${comentario.id}`);
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/comentario/${id}/estado`, {
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
    c.usuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="comentarios-box">
      <h2>Comentarios</h2>

      <input
        type="text"
        placeholder="Buscar usuario..."
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
          {comentariosFiltrados.map((c) => (
            <tr key={c.id} className="comentario-item">
              <td>{c.usuario}</td>
              <td>{c.contenido}</td>
              <td>{c.fecha}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comentarios;
