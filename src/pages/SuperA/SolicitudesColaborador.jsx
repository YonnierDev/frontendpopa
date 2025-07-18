import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { api } from "../../components/api/api";
import "./styles/CalificacionesSuper.css"; // Usa los mismos estilos

const SolicitudesColaborador = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/solicitud");
      setSolicitudes(res.data || []);
    } catch (err) {
      toast.error("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await api.patch(`/api/solicitud/${id}/estado`, { estado: nuevoEstado });
      toast.success(`Solicitud ${nuevoEstado}`);
      fetchSolicitudes();
    } catch (err) {
      toast.error("Error al cambiar el estado");
    }
  };

  const eliminarSolicitud = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta solicitud?")) return;

    try {
      await api.delete(`/solicitud/${id}`);
      toast.success("Solicitud eliminada");
      fetchSolicitudes();
    } catch (err) {
      toast.error("Error al eliminar la solicitud");
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const filteredSolicitudes = solicitudes.filter((s) => {
    const nombreCompleto = `${s.usuario?.nombre || ""} ${s.usuario?.apellido || ""}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  if (loading) return <div className="calificaciones-loading">Cargando solicitudes...</div>;

  return (
    <div className="calificaciones-container">
      <div className="calificaciones-header">
        <h1 className="calificaciones-title">Gestión de Solicitudes de Colaborador</h1>
        <div className="calificaciones-header-actions">
          <div className="calificaciones-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="calificaciones-form-input"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="calificaciones-table-container">
        <table className="calificaciones-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredSolicitudes.length === 0 ? (
              <tr>
                <td colSpan="5" className="calificaciones-no-data">
                  No hay solicitudes disponibles
                </td>
              </tr>
            ) : (
              filteredSolicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.usuario?.nombre} {s.usuario?.apellido}</td>
                  <td>{s.descripcion}</td>
                  <td>
                    <span className={`calificaciones-status-badge ${s.estado === "Aceptado" ? "active" : "inactive"}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    <div className="calificaciones-actions">
                      <button
                        className="calificaciones-btn calificaciones-btn-secondary"
                        onClick={() => cambiarEstado(s.id, "Aceptado")}
                        title="Aceptar"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="calificaciones-btn calificaciones-btn-warning"
                        onClick={() => cambiarEstado(s.id, "Rechazado")}
                        title="Rechazar"
                      >
                        <FaTimes />
                      </button>
                      <button
                        className="calificaciones-btn calificaciones-btn-danger"
                        onClick={() => eliminarSolicitud(s.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
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

export default SolicitudesColaborador;
