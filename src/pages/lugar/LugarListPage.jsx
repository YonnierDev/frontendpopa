import { useEffect, useState } from "react";
import { api } from "../api/api";

const LugarListPage = () => {
  const [lugares, setLugares] = useState([]);
  const [editLugar, setEditLugar] = useState(null);
  const [searchId, setSearchId] = useState("");

  // Obtener todos los lugares
  const fetchLugares = async () => {
    try {
      const response = await api.get("/lugares");
      setLugares(response.data);
    } catch (error) {
      console.error("Error al obtener los lugares:", error.response?.data || error.message);
    }
  };

  // Buscar un lugar por ID
  const fetchLugarById = async () => {
    if (!searchId) return;
    try {
      const response = await api.get(`/lugar/${searchId}`);
      setLugares([response.data]);
    } catch (error) {
      console.error("Error al buscar el lugar:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchLugares();
  }, []);

  // Editar lugar
  const handleEditClick = (lugar) => {
    setEditLugar({ ...lugar });
  };

  // Guardar cambios en la edición
  const handleSaveEdit = async () => {
    if (!editLugar) return;
    try {
      await api.put(`/lugar/${editLugar.id}`, editLugar);
      setEditLugar(null);
      fetchLugares();
    } catch (error) {
      console.error("Error al guardar los cambios:", error.response?.data || error.message);
    }
  };

  // Cambiar estado (activar/desactivar)
  const handleToggleActive = async (id) => {
    try {
      await api.put(`/lugar/${id}/estado`);
      fetchLugares();
    } catch (error) {
      console.error("Error al cambiar el estado:", error.response?.data || error.message);
    }
  };

  return (
    <div class="color1">
      <h2>Lista de Lugares</h2>
      <div>
        <input
          type="text"
          placeholder="Buscar por ID..."
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={fetchLugarById}>Buscar</button>
        <button onClick={fetchLugares}>Listar Todos</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Categoria</th>
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
              <td>{lugar.id}</td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <input
                    type="number"
                    value={editLugar.categoriaid}
                    onChange={(e) => setEditLugar({ ...editLugar, categoriaid: e.target.value })}
                  />
                ) : (
                  lugar.categoriaid
                )}
              </td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <input
                    type="number"
                    value={editLugar.usuarioid}
                    onChange={(e) => setEditLugar({ ...editLugar, usuarioid: e.target.value })}
                  />
                ) : (
                  lugar.usuarioid
                )}
              </td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <input
                    type="text"
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
                    value={editLugar.ubicacion}
                    onChange={(e) => setEditLugar({ ...editLugar, ubicacion: e.target.value })}
                  />
                ) : (
                  lugar.ubicacion
                )}
              </td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <select
                    value={editLugar.estado}
                    onChange={(e) => setEditLugar({ ...editLugar, estado: e.target.value === "true" })}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                ) : (
                  lugar.estado ? "Activo" : "Inactivo"
                )}
              </td>
              <td>
                {editLugar?.id === lugar.id ? (
                  <button onClick={handleSaveEdit}>Guardar</button>
                ) : (
                  <button onClick={() => handleEditClick(lugar)}>Editar</button>
                )}
                <button onClick={() => handleToggleActive(lugar.id)}>
                  {lugar.estado ? "Desactivar" : "Activar"}
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
