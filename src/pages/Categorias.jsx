import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Categorias.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editarId, setEditarId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias");
      setCategorias(response.data || []);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      await axios.post("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias", {
        nombre: nuevaCategoria,
        estado: true,
      });
      setNuevaCategoria("");
      obtenerCategorias();
    } catch (error) {
      console.error("Error al crear categoría:", error);
    }
  };

  const editarCategoria = async (id) => {
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias/${id}`, {
        nombre: nombreEditado,
      });
      setEditarId(null);
      obtenerCategorias();
    } catch (error) {
      console.error("Error al editar categoría:", error);
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias/${id}`);
      obtenerCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  const cambiarEstado = async (id, estadoActual) => {
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/categorias/${id}`, {
        estado: !estadoActual,
      });
      obtenerCategorias();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="categorias-box">
      <h2>Categorías</h2>

      <div className="card-formulario">
        <h3>Agregar Nueva Categoría</h3>
        <div className="formulario-categorias">
          <input
            type="text"
            placeholder="Nueva categoría"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
          />
          <button onClick={crearCategoria}>Crear</button>
        </div>
      </div>

      {/* Buscador centrado entre cards */}
      <div className="buscador-centrado">
        <input
          className="buscador-categorias"
          type="text"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="card-categorias">
        <table className="tabla-categorias">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>
                  {editarId === cat.id ? (
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                    />
                  ) : (
                    cat.nombre
                  )}
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={cat.estado}
                      onChange={() => cambiarEstado(cat.id, cat.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                   {editarId === cat.id ? (
                     <button className="boton-accion" onClick={() => editarCategoria(cat.id)}>Guardar</button>
                   ) : (
                      <button className="boton-accion" onClick={() => {
                         setEditarId(cat.id);
                         setNombreEditado(cat.nombre);
                       }}>
                          Editar
                        </button>
                      )}
                      <button className="boton-accion" onClick={() => eliminarCategoria(cat.id)}>Eliminar</button>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categorias;
