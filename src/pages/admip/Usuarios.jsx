import { useState, useEffect } from "react";  
import axios from "axios";
import "../admip/styles/Usuarios.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mensajesEstado, setMensajesEstado] = useState({});

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/usuario/estado/${id}`, {
        activo: nuevoEstado,
      });
      setUsuarios(usuarios.map(u => (u.id === id ? { ...u, estado: nuevoEstado } : u)));
      setMensajesEstado(prev => ({
        ...prev,
        [id]: nuevoEstado ? "Activo" : "Inactivo"
      }));
    } catch (error) {
      console.error("Error al cambiar estado del usuario", error);
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.put(`https://popnocturna.vercel.app/api/usuario/${usuarioSeleccionado.id}`, usuarioSeleccionado);
      setUsuarios(usuarios.map(u => (u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u)));
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error al editar usuario", error);
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      {/* Sección de Usuarios */}
      <div className="usuarios-box decoracion-esquina">
        <h2>Lista de Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador-usuarios"
        />

        <table className="usuarios-tabla">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Fecha de Nacimiento</th>
              <th>Género</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id}>
                <td>{u.rolid}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.fecha_nacimiento}</td>
                <td>{u.genero}</td>
                <td>
                  <button className="editar" onClick={() => handleEditar(u)}>Editar</button>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={u.estado}
                      onChange={() => toggleEstado(u.id, u.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                  <div className="mensaje-estado">
                    {mensajesEstado[u.id]}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edición */}
      {usuarioSeleccionado && (
        <div className="modal">
          <div className="modal-contenido">
            <h3>Editar Usuario</h3>
            <input
              type="text"
              value={usuarioSeleccionado.nombre}
              onChange={(e) =>
                setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })
              }
            />
            <input
              type="text"
              value={usuarioSeleccionado.apellido}
              onChange={(e) =>
                setUsuarioSeleccionado({ ...usuarioSeleccionado, apellido: e.target.value })
              }
            />
            <input
              type="email"
              value={usuarioSeleccionado.correo}
              onChange={(e) =>
                setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: e.target.value })
              }
            />
            <button className="guardar" onClick={handleGuardarEdicion}>
              Guardar
            </button>
            <button className="cerrar-modal" onClick={() => setUsuarioSeleccionado(null)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
