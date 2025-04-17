import React, { useState, useEffect } from 'react';
import { api } from "../../components/api/api";
import './Comentarios.css';
import Sidebar from '../../components/Sidebar';

const Comentarios = () => {
  const [comentarios, setComentarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const response = await api.get("/comentarios"); // Este endpoint debe devolver todos los comentarios
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al cargar los comentarios:", error);
      setMensaje('Error al cargar los comentarios');
    }
  };

  return (
    <>
      <Sidebar />
      <div className="app-container">
        <div className="main-content">
          <h2>Comentarios de Popayán Nocturna</h2>

          {mensaje && <div className="mensaje">{mensaje}</div>}

          <table className="tabla-comentarios">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody>
              {comentarios.map((comentario) => (
                <tr key={comentario.id}>
                  <td>{comentario.usuario?.nombre || `Usuario ID ${comentario.usuarioid}`}</td>
                  <td>{comentario.contenido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Comentarios;
