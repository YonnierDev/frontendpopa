import React, { useEffect, useState } from "react";
import axios from "axios";
import "../admip/styles/Categorias.css";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editarId, setEditarId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/categorias");
      setCategorias(response.data || []);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const editarCategoria = async (id) => {
    if (!nombreEditado.trim()) return; // Asegura que no se edite con nombre vacío
    try {
      await axios.put(`https://popnocturna.vercel.app/api/categoria/${id}`, {
        tipo: nombreEditado,
      });
      setEditarId(null);
      obtenerCategorias();
    } catch (error) {
      console.error("Error al editar categoría:", error);
    }
  };

  const cambiarEstado = async (id, estadoActual) => {
    try {
      await axios.put(`https://popnocturna.vercel.app/api/categoria/${id}`, {
        estado: !estadoActual,
      });
      obtenerCategorias();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat?.tipo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="categorias-box">
      <div className="card-categorias">
        <h2>Categorías</h2>
        <div className="buscador-centrado">
          <input
            className="buscador-categorias"
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="tabla-categorias">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
              <th>Estado</th>
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
                    cat.tipo
                  )}
                </td>
                <td>
                  {editarId === cat.id ? (
                    <button className="boton-accion" onClick={() => editarCategoria(cat.id)}>Guardar</button>
                  ) : (
                    <button className="boton-accion" onClick={() => {
                      setEditarId(cat.id);
                      setNombreEditado(cat.tipo);
                    }}>
                      Editar
                    </button>
                  )}
                  {/* Botón eliminar eliminado */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categorias;
