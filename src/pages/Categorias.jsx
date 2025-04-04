import { useState, useEffect } from "react";
import axios from "axios";
import "./Categorias.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", descripcion: "", activo: true });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener categorías", error);
    }
  };

  const handleChange = (e) => {
    setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value });
  };

  const crearCategoria = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categoria", nuevaCategoria);
      fetchCategorias();
      setNuevaCategoria({ nombre: "", descripcion: "", activo: true });
    } catch (error) {
      console.error("Error al crear categoría", error);
    }
  };

  const iniciarEdicion = (categoria) => {
    setEditando(categoria);
  };

  const cancelarEdicion = () => {
    setEditando(null);
  };

  const guardarEdicion = async () => {
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categoria/${editando.id}`, editando);
      fetchCategorias();
      setEditando(null);
    } catch (error) {
      console.error("Error al editar categoría", error);
    }
  };

  const eliminarCategoria = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;
    try {
      await axios.delete(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categoria/${id}`);
      fetchCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categoria/${id}/estado`, {
        activo: !estadoActual,
      });
      fetchCategorias();
    } catch (error) {
      console.error("Error al cambiar estado de categoría", error);
    }
  };

  return (
    <div className="categorias-box">
      <h2>Categorías</h2>

      {/* Formulario de creación */}
      <form className="formulario-categorias" onSubmit={crearCategoria}>
        <input type="text" name="nombre" placeholder="Nombre" value={nuevaCategoria.nombre} onChange={handleChange} required />
        <input type="text" name="descripcion" placeholder="Descripción" value={nuevaCategoria.descripcion} onChange={handleChange} />
        <button type="submit">Crear Categoría</button>
      </form>

      {/* Tabla de categorías */}
      <table className="tabla-categorias">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td>
                {editando && editando.id === categoria.id ? (
                  <input
                    type="text"
                    value={editando.nombre}
                    onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                  />
                ) : (
                  categoria.nombre
                )}
              </td>
              <td>
                {editando && editando.id === categoria.id ? (
                  <input
                    type="text"
                    value={editando.descripcion}
                    onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                  />
                ) : (
                  categoria.descripcion
                )}
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={categoria.activo}
                    onChange={() => toggleEstado(categoria.id, categoria.activo)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td>
                {editando && editando.id === categoria.id ? (
                  <>
                    <button onClick={guardarEdicion}>Guardar</button>
                    <button onClick={cancelarEdicion}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicion(categoria)}>Editar</button>
                    <button onClick={() => eliminarCategoria(categoria.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categorias;
