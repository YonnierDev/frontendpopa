import { useState, useEffect } from "react";
import axios from "axios";
import "../admip/styles/Solicitudes.css";

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://popnocturna.vercel.app/api/aprobar")
            .then(res => {
                setSolicitudes(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al obtener solicitudes:", err);
                setLoading(false);
            });
    }, []);

    const actualizarEstado = (id, nuevoEstado) => {
        axios.patch(`https://popnocturna.vercel.app/api/aprobar/${id}`, { estado: nuevoEstado })
            .then(() => {
                setSolicitudes(prev =>
                    prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s)
                );
            })
            .catch(err => console.error("Error al actualizar estado:", err));
    };

    return (
        <div className="solicitudes-box">
            <h2>Solicitudes de Creación de Lugar</h2>
            {loading ? (
                <p className="loading-text">Cargando...</p>
            ) : solicitudes.length === 0 ? (
                <p className="no-solicitudes">No hay solicitudes pendientes</p>
            ) : (
                <ul className="solicitudes-ul">
                    {solicitudes.map(solicitud => (
                        <li key={solicitud.id} className="solicitud-item">
                            <p><strong>Propietario:</strong> {solicitud.usuarioid}</p>
                            <p><strong>Nombre del Lugar:</strong> {solicitud.nombre}</p>
                            <p><strong>Descripción:</strong> {solicitud.descripcion}</p>
                            <p><strong>Ubicación:</strong> {solicitud.ubicacion}</p>
                            <p><strong>Estado:</strong> {solicitud.estado ? "activo" : "inactivo"}</p>
                            <div className="botones-container">
                                <button
                                    className="aceptar"
                                    onClick={() => actualizarEstado(solicitud.id, "aceptado")}
                                    disabled={solicitud.estado !== false}
                                >
                                    Aceptar
                                </button>
                                <button
                                    className="rechazar"
                                    onClick={() => actualizarEstado(solicitud.id, "rechazado")}
                                    disabled={solicitud.estado !== false}
                                >
                                    Rechazar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Solicitudes;
