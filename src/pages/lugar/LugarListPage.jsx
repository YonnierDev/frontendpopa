import { useEffect, useState } from "react";
import { getLugares, getLugarById, updateLugar, toggleLugarEstado } from "../api/lugares";
import { FaEdit, FaSave, FaToggleOn, FaToggleOff, FaSearch, FaList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LugarListPage.css";

const LugarListPage = () => {
  const [lugares, setLugares] = useState([]);
  const [editLugar, setEditLugar] = useState(null);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchLugares();
  }, []);

  const fetchLugares = async () => {
    const data = await getLugares();
    setLugares(data);
  };

  const fetchLugarById = async () => {
    if (!searchId) return;
    const data = await getLugarById(searchId);
    if (data) setLugares([data]);
  };

  const handleEditClick = (lugar) => {
    setEditLugar({ ...lugar });
  };

  const handleSaveEdit = async () => {
    if (!editLugar) return;
    await updateLugar(editLugar.id, editLugar);
    setEditLugar(null);
    fetchLugares();
  };

  const handleToggleActive = async (id) => {
    await toggleLugarEstado(id);
    fetchLugares();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista de Lugares</h2>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-25 me-2"
          placeholder="Buscar por ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button className="btn btn-primary me-2" onClick={fetchLugarById}>
          <FaSearch /> Buscar
        </button>
        <button className="btn btn-secondary" onClick={fetchLugares}>
          <FaList /> Listar Todos
        </button>
      </div>
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Categoría</th>
            <th>Usuario</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lugares.map((lugar) => (
            <tr key={lugar.id}>
              <td>{lugar.categorias?.tipo || "Sin categoría"}</td>
              <td>{lugar.usuarios?.nombre || "Sin usuario"}</td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editLugar.descripcion}
                    onChange={(e) => setEditLugar({ ...editLugar, descripcion: e.target.value })}
                  />
                ) : (
                  lugar.descripcion
                )}
              </td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editLugar.ubicacion}
                    onChange={(e) => setEditLugar({ ...editLugar, ubicacion: e.target.value })}
                  />
                ) : (
                  lugar.ubicacion
                )}
              </td>
              <td>
                <span className={`badge ${lugar.estado ? "bg-success" : "bg-danger"}`}>
                  {lugar.estado ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="d-flex justify-content-center">
                {editLugar?.id === lugar.id ? (
                  <button className="btn btn-success btn-sm me-2" onClick={handleSaveEdit}>
                    <FaSave /> Guardar
                  </button>
                ) : (
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(lugar)}>
                    <FaEdit /> Editar
                  </button>
                )}
                <button
                  className={`btn btn-sm ${lugar.estado ? "btn-danger" : "btn-success"}`}
                  onClick={() => handleToggleActive(lugar.id)}
                >
                  {lugar.estado ? <FaToggleOff /> : <FaToggleOn />} {lugar.estado ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LugarListPage;
