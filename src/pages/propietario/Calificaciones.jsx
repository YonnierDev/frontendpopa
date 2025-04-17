import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import './Calificaciones.css';
import Sidebar from '../../components/Sidebar';

const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCalificaciones();
    cargarUsuarios();
  }, []);

  const cargarCalificaciones = async () => {
    try {
      const response = await api.get("/calificaciones");
      setCalificaciones(response.data);
    } catch (error) {
      console.error("Error:", error.response || error);
      setMensaje('Error al cargar las calificaciones: ' + (error.response?.data?.message || error.message));
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error.response || error);
    }
  };

  const calcularPromedio = () => {
    const total = calificaciones.reduce((acc, c) => acc + c.puntuacion, 0);
    return (total / calificaciones.length) || 0;
  };

  const obtenerNombreUsuario = (usuarioid) => {
    const usuario = usuarios.find(user => user.id === usuarioid);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Desconocido';
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Calificaciones de Popayán Nocturna</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <p className="promedio-texto">
            Promedio de Calificaciones: ⭐ {calcularPromedio().toFixed(1)}
          </p>

          <table className="tabla-calificaciones">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Calificación</th>
              </tr>
            </thead>
            <tbody>
              {calificaciones.map((calificacion) => (
                <tr key={calificacion.id}>
                  <td>{obtenerNombreUsuario(calificacion.usuarioid)}</td>
                  <td>⭐ {calificacion.puntuacion}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Calificaciones;
