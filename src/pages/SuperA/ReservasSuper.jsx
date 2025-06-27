import React, { useState, useEffect } from "react";
import {
  FaCalendar,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUser,
  FaEye,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/ReservasSuper.css";
import "./styles/SuperReservas.css";

const ReservasSuper = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "fecha_hora",
    direction: "desc",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!token || !usuario || ![1, 2, 3, 8].includes(usuario.rol)) {
      setError(
        "No tienes permisos para acceder a esta página. Solo SuperAdmin, Administrador, Propietario y Usuario pueden acceder."
      );
      setLoading(false);
      return;
    }

    fetchReservas();
  }, [filterStatus, fechaDesde, fechaHasta, currentPage, searchTerm]);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!token || !usuario || ![1, 2, 3, 8].includes(usuario.rol)) {
        setError("No tienes permisos para acceder a esta página.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "all" && { estado: filterStatus }),
        ...(fechaDesde && { fechaDesde }),
        ...(fechaHasta && { fechaHasta }),
      });

      const response = await axios.get(
        `https://popnocturna.vercel.app/api/reservas?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.datos) {
        const reservasData = Array.isArray(response.data.datos)
          ? response.data.datos
          : response.data.datos.rows || [];

        setReservas(reservasData);
        setTotalPages(
          Math.ceil(
            (response.data.datos.count || reservasData.length) / itemsPerPage
          )
        );
      } else {
        setReservas([]);
        setError("No hay reservas disponibles");
      }
    } catch (error) {
      console.error("Error al cargar reservas:", error);
      setReservas([]);
      setError(error.response?.data?.mensaje || "Error al cargar las reservas");
      toast.error(
        error.response?.data?.mensaje || "Error al cargar las reservas"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAprobarReserva = async (numero_reserva, aprobacion) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `https://popnocturna.vercel.app/api/reserva/aprobar/${numero_reserva}`,
        { aprobacion },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Estado de reserva actualizado correctamente");
      fetchReservas();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      toast.error(
        error.response?.data?.mensaje ||
          "Error al actualizar el estado de la reserva"
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta reserva?")) {
      try {
        const token = localStorage.getItem("token");
        const usuario = JSON.parse(localStorage.getItem("usuario"));

        if (!token || !usuario) {
          toast.error("No hay sesión activa");
          return;
        }

        // Verificar si el usuario tiene permisos (rol 1 o 2)
        if (![1, 2].includes(usuario.rol)) {
          toast.error("No tienes permisos para eliminar reservas");
          return;
        }

        // Primero verificar si la reserva existe
        const checkResponse = await axios.get(
          `https://popnocturna.vercel.app/api/reserva/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!checkResponse.data) {
          toast.error("La reserva no existe");
          return;
        }

        // Si la reserva existe, proceder con la eliminación
        const response = await axios({
          method: "delete",
          url: `https://popnocturna.vercel.app/api/reserva/${id}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.mensaje) {
          toast.success(response.data.mensaje);
          // Actualizar la lista de reservas
          fetchReservas();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        if (error.response) {
          // El servidor respondió con un código de error
          const errorMessage =
            error.response.data?.mensaje || "Error al eliminar la reserva";
          toast.error(errorMessage);
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          toast.error("No se recibió respuesta del servidor");
        } else {
          // Error al configurar la petición
          toast.error("Error al procesar la solicitud");
        }
      }
    }
  };

  const handleView = async (numero_reserva) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://popnocturna.vercel.app/api/reserva/${numero_reserva}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedReserva(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error al cargar detalles:", error);
      toast.error(
        error.response?.data?.mensaje ||
          "Error al cargar los detalles de la reserva"
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";

      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "Fecha inválida";
    }
  };
  if (loading) return <div className="super-loading">Cargando...</div>;
  if (error)
    return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="super-reservas-layout">
      <div className="super-reservas-header">
        <h1 className="super-reservas-title">Gestión de Reservas</h1>
        <div className="super-reservas-filters">
          <input
            type="text"
            placeholder="Buscar reservas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="super-reservas-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="super-select-reservas"
          >
            <option value="all">Todos los estados</option>
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <FaCalendar
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                  zIndex: 10,
                }}
              />
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                style={{
                  padding: "10px 10px 10px 35px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease",
                  ":focus": {
                    outline: "none",
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                  "::-webkit-calendar-picker-indicator": {
                    opacity: 0,
                    position: "absolute",
                    right: "0",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  },
                }}
                placeholder="Fecha desde"
              />
            </div>

            <span style={{ color: "#6b7280" }}>a</span>

            <div style={{ position: "relative" }}>
              <FaCalendar
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6b7280",
                  zIndex: 10,
                }}
              />
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                style={{
                  padding: "10px 10px 10px 35px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "#f9fafb",
                  color: "#111827",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease",
                  ":focus": {
                    outline: "none",
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                  },
                  "::-webkit-calendar-picker-indicator": {
                    opacity: 0,
                    position: "absolute",
                    right: "0",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  },
                }}
                placeholder="Fecha hasta"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="super-reservas-table-container"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
          overflow: "auto",
        }}
      >
        <table
          className="super-reservas-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Número Reserva
              </th>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Usuario
              </th>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Evento
              </th>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Fecha
              </th>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Estado
              </th>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Aprobación
              </th>
              <th style={{ padding: "12px", textAlign: "left", color: "#333" }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  No hay reservas disponibles
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr key={reserva.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px", color: "#333" }}>
                    {reserva.numero_reserva}
                  </td>
                  <td style={{ padding: "12px", color: "#333" }}>
                    {reserva.usuario?.nombre || "Usuario no disponible"}
                  </td>
                  <td style={{ padding: "12px", color: "#333" }}>
                    {reserva.evento?.nombre || "Evento no disponible"}
                  </td>
                  <td style={{ padding: "12px", color: "#333" }}>
                    {formatDate(reserva.fecha_hora)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: reserva.estado ? "#4CAF50" : "#f44336",
                        color: "white",
                      }}
                    >
                      {reserva.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor:
                          reserva.aprobacion === "aceptado"
                            ? "#4CAF50"
                            : reserva.aprobacion === "rechazado"
                            ? "#f44336"
                            : "#FFA500",
                        color: "white",
                      }}
                    >
                      {reserva.aprobacion || "Pendiente"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div
                      className="super-reservas-actions"
                      style={{ display: "flex", gap: "8px" }}
                    >
                      <button
                        className="super-reservas-btn view"
                        onClick={() => handleView(reserva.numero_reserva)}
                        title="Ver detalles"
                        style={{
                          padding: "6px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        <FaEye />
                      </button>
                      {[1, 2].includes(
                        JSON.parse(localStorage.getItem("usuario"))?.rol
                      ) && (
                        <button
                          className="super-reservas-btn delete"
                          onClick={() => handleDelete(reserva.id)}
                          title="Eliminar reserva"
                          style={{
                            padding: "6px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <FaTrash />
                        </button>
                      )}
                      {[1, 2, 3].includes(
                        JSON.parse(localStorage.getItem("usuario"))?.rol
                      ) && (
                        <>
                          <button
                            className="super-reservas-btn approve"
                            onClick={() =>
                              handleAprobarReserva(
                                reserva.numero_reserva,
                                "aceptado"
                              )
                            }
                            title="Aprobar reserva"
                            style={{
                              padding: "6px",
                              backgroundColor: "#4CAF50",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="super-reservas-btn reject"
                            onClick={() =>
                              handleAprobarReserva(
                                reserva.numero_reserva,
                                "rechazado"
                              )
                            }
                            title="Rechazar reserva"
                            style={{
                              padding: "6px",
                              backgroundColor: "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedReserva && selectedReserva.data && (
        <div className="super-modal">
          <div
            className="super-modal-content"
            style={{
              backgroundColor: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "650px",
              boxShadow: "0 5px 20px rgba(0, 0, 0, 0.2)",
              border: "1px solid #e0e0e0",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#666",
                padding: "5px",
              }}
            >
              &times;
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
              }}
            >
              <h2
                style={{
                  color: "#ffffff",
                  margin: 0,
                  fontSize: "24px",
                  marginLeft: "80px",
                }}
              >
                Detalles de la Reserva
                <span
                  style={{
                    fontSize: "16px",
                    color: "#ffffff",
                    marginLeft: "50px",
                  }}
                >
                  N° {selectedReserva.data.numero_reserva}
                </span>
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              {/* Columna izquierda */}
              <div>
                <div style={{ marginBottom: "15px" }}>
                  <h3
                    style={{
                      color: "#3498db",
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaUser style={{ marginRight: "8px" }} /> Información del
                    Usuario
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Nombre:</strong>{" "}
                      {selectedReserva.data.usuario?.nombre || "No disponible"}
                    </p>
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Correo:</strong>{" "}
                      {selectedReserva.data.usuario?.correo || "No disponible"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      color: "#3498db",
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaCalendar style={{ marginRight: "8px" }} /> Fechas
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Reserva realizada:</strong>{" "}
                      {formatDate(selectedReserva.data.fecha_hora) ||
                        "No disponible"}
                    </p>
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Evento programado:</strong>{" "}
                      {formatDate(selectedReserva.data.evento?.fecha_hora) ||
                        "No disponible"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna derecha */}
              <div>
                <div style={{ marginBottom: "15px" }}>
                  <h3
                    style={{
                      color: "#3498db",
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaCalendar style={{ marginRight: "8px" }} /> Detalles del
                    Evento
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Evento:</strong>{" "}
                      {selectedReserva.data.evento?.nombre || "No disponible"}
                    </p>
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Lugar:</strong>{" "}
                      {selectedReserva.data.evento?.lugar?.nombre ||
                        "No disponible"}
                    </p>
                    <p style={{ margin: "8px 0", color: "#34495e" }}>
                      <strong>Entradas:</strong>{" "}
                      {selectedReserva.data.cantidad_entradas || "0"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      color: "#3498db",
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaCheck style={{ marginRight: "8px" }} /> Estado
                  </h3>
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p style={{ margin: "8px 0", color: "#34495e" }}>
                        <strong>Estado:</strong>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            backgroundColor: selectedReserva.data.estado
                              ? "#2ecc71"
                              : "#e74c3c",
                            color: "white",
                            marginLeft: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {selectedReserva.data.estado ? "Activo" : "Inactivo"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "8px 0", color: "#34495e" }}>
                        <strong>Aprobación:</strong>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: "20px",
                            backgroundColor:
                              selectedReserva.data.aprobacion === "aceptado"
                                ? "#2ecc71"
                                : selectedReserva.data.aprobacion ===
                                  "rechazado"
                                ? "#e74c3c"
                                : "#f39c12",
                            color: "white",
                            marginLeft: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          {selectedReserva.data.aprobacion || "Pendiente"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s",
                  ":hover": {
                    backgroundColor: "#2980b9",
                  },
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasSuper;
