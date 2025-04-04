import { useState, useEffect } from "react";
import axios from "axios";
import "./Usuarios.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    rol: "",
    nombre: "",
    apellido: "",
    correo: "",
    fechaNacimiento: "",
    genero: "",
    activo: true,
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/usuario/${id}/estado`, {
        activo: nuevoEstado,
      });
      setUsuarios(usuarios.map(u => (u.id === id ? { ...u, activo: nuevoEstado } : u)));
    } catch (error) {
      console.error("Error al cambiar estado del usuario", error);
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.put(`https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/usuario/${usuarioSeleccionado.id}`, usuarioSeleccionado);
      setUsuarios(usuarios.map(u => (u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u)));
      setUsuarioSeleccionado(null);
    } catch (error) {
      console.error("Error al editar usuario", error);
    }
  };

  const handleCrearUsuario = async () => {
    try {
      const response = await axios.post("https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api/usuario", nuevoUsuario);
      setUsuarios([...usuarios, response.data]);
      setNuevoUsuario({
        rol: "",
        nombre: "",
        apellido: "",
        correo: "",
        fechaNacimiento: "",
        genero: "",
        activo: true,
      });
    } catch (error) {
      console.error("Error al crear usuario", error);
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="usuarios-container">
      {/* Sección de Usuarios */}
      <div className="usuarios-box">
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
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id}>
                <td>{u.rol}</td>
                <td>{u.nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.fechaNacimiento}</td>
                <td>{u.genero}</td>
                <td>
                  <label className="switch">
                    <input type="checkbox" checked={u.activo} onChange={() => toggleEstado(u.id, u.activo)} />
                    <span className="slider"></span>
                  </label>
                </td>
                <td>
                  <button className="editar" onClick={() => handleEditar(u)}>Editar</button>
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
            <input type="text" value={usuarioSeleccionado.nombre} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })} />
            <input type="text" value={usuarioSeleccionado.apellido} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, apellido: e.target.value })} />
            <input type="email" value={usuarioSeleccionado.correo} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: e.target.value })} />
            <button className="guardar" onClick={handleGuardarEdicion}>Guardar</button>
            <button className="cerrar-modal" onClick={() => setUsuarioSeleccionado(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Sección de Crear Usuario */}
      <div className="formulario">
        <h2>Crear Usuario</h2>
        <input type="text" placeholder="Rol" value={nuevoUsuario.rol} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })} />
        <input type="text" placeholder="Nombre" value={nuevoUsuario.nombre} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })} />
        <input type="text" placeholder="Apellido" value={nuevoUsuario.apellido} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })} />
        <input type="email" placeholder="Correo" value={nuevoUsuario.correo} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })} />
        <input type="date" value={nuevoUsuario.fechaNacimiento} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, fechaNacimiento: e.target.value })} />
        <select value={nuevoUsuario.genero} onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, genero: e.target.value })}>
          <option value="">Seleccionar Género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
        <button className="crear" onClick={handleCrearUsuario}>Crear Usuario</button>
      </div>
    </div>
  );
};

export default Usuarios;
