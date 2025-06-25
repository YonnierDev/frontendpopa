import React, { useState, useEffect } from "react";
import { FaClock, FaCheck, FaTimes, FaSearch, FaFilter } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/PendientesSuper.css";

const PendientesSuper = ({ actualizarContador }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://popnocturna.vercel.app/api/lugares/pendientes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Obtener los usuarios para mostrar sus nombres
      const usuariosResponse = await axios.get(
        "https://popnocturna.vercel.app/api/usuarios",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Crear un mapa de usuarios por ID
      const usuariosMap = {};
      usuariosResponse.data.forEach((usuario) => {
        usuariosMap[usuario.id] = usuario.nombre;
      });

      setUsuarios(usuariosMap);
      setSolicitudes(response.data.lugares);
      setError(null);

      // Actualizar el contador en el sidebar
      console.log("Número de solicitudes:", response.data.lugares.length);
      if (actualizarContador && typeof actualizarContador === "function") {
        actualizarContador(response.data.lugares.length);
      }
    } catch (err) {
      console.error("Error al obtener solicitudes:", err);
      setError("Error al cargar las solicitudes");
      // Resetear el contador en caso de error
      if (actualizarContador && typeof actualizarContador === "function") {
        actualizarContador(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(
        `https://popnocturna.vercel.app/api/lugar/${id}/estado`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filtrar la solicitud que fue procesada y actualizar el contador
      setSolicitudes((prev) => {
        const nuevasSolicitudes = prev.filter((s) => s.id !== id);
        console.log("Nuevo número de solicitudes:", nuevasSolicitudes.length);
        if (actualizarContador && typeof actualizarContador === "function") {
          actualizarContador(nuevasSolicitudes.length);
        }
        return nuevasSolicitudes;
      });

      toast.success("Estado actualizado correctamente");
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      setError("Error al actualizar el estado de la solicitud");
      toast.error("Error al actualizar el estado");
    }
  };

  // Efecto para actualizar el contador cuando cambia el número de solicitudes
  useEffect(() => {
    if (actualizarContador && typeof actualizarContador === "function") {
      actualizarContador(solicitudes.length);
    }
  }, [solicitudes.length, actualizarContador]);

  if (loading) {
    return (
      <div className="pendientes-super-container">
        <h2 className="pendientes-super-title">
          Solicitudes de Creación de Lugar
        </h2>
        <p className="pendientes-super-loading">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pendientes-super-container">
        <h2 className="pendientes-super-title">
          Solicitudes de Creación de Lugar
        </h2>
        <p className="pendientes-super-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="pendientes-super-container">
      <h2 className="pendientes-super-title">
        Solicitudes de Creación de Lugar
      </h2>
      {solicitudes.length === 0 ? (
        <p className="pendientes-super-empty">No hay solicitudes pendientes</p>
      ) : (
        <table className="pendientes-super-table">
          <thead>
            <tr>
              <th>Propietario</th>
              <th>Nombre del Lugar</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id} className="pendientes-super-row">
                <td>{usuarios[solicitud.usuarioid] || "Cargando..."}</td>
                <td>{solicitud.nombre}</td>
                <td>{solicitud.descripcion}</td>
                <td>{solicitud.ubicacion}</td>
                <td
                  className={`pendientes-super-status ${
                    solicitud.aprobacion ? "active" : "inactive"
                  }`}
                >
                  {solicitud.aprobacion ? "Activo" : "Inactivo"}
                </td>
                <td></td>
                <td className="pendientes-super-actions">
                  <button
                    className="pendientes-super-btn pendientes-super-btn-accept"
                    onClick={() => actualizarEstado(solicitud.id, true)}
                  >
                    Aceptar
                  </button>
                  <button
                    className="pendientes-super-btn pendientes-super-btn-reject"
                    onClick={() => actualizarEstado(solicitud.id, false)}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendientesSuper;
