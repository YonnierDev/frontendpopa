import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/CategoriasSuper.css";
import { FaTags, FaEdit, FaTrash, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

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
    if (!nombreEditado.trim()) return;
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
      const nuevoEstado = !estadoActual;
      await axios.patch(`https://popnocturna.vercel.app/api/categoria/estado/${id}`, {
        estado: nuevoEstado,
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
    <div className="categorias-box-super">
      <div className="card-categorias-super">
        <h2>Categorías</h2>

        <div className="buscador-centrado-super">
          <input
            className="buscador-categorias-super"
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <table className="tabla-categorias-super">
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
                    <button className="boton-accion-super" onClick={() => editarCategoria(cat.id)}>Guardar</button>
                  ) : (
                    <button
                      className="boton-accion-super"
                      onClick={() => {
                        setEditarId(cat.id);
                        setNombreEditado(cat.tipo);
                      }}
                    >
                      Editar
                    </button>
                  )}
                </td>
                <td>
                  <label className="switch-super">
                    <input
                      type="checkbox"
                      checked={cat.estado}
                      onChange={() => cambiarEstado(cat.id, cat.estado)}
                    />
                    <span className="slider-super"></span>
                  </label>
                  <div>
                    {cat.estado ? "Activo" : "Inactivo"}
                  </div>
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
