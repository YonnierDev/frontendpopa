import "./UsuariosListPage.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario, toggleEstadoUsuario} from "../../../store/usuarios/usuariosSlice";

const UsuariosListPage = () => {
  console.log("👉 Cargando UsuariosListPage"); // Este log te va a confirmar si entra
  const dispatch = useDispatch();
  const { usuarios, loading, error } = useSelector((state) => state.usuarios);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    fecha_nacimiento: "",
    contrasena: "",
    genero: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: "",
      apellido: "",
      correo: "",
      fecha_nacimiento: "",
      contrasena: "",
      genero: "",
    });
    setModoEdicion(false);
    setUsuarioEditando(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modoEdicion && usuarioEditando) {
      const datosActualizados = { ...form, rolid: usuarioEditando.rolid, estado: usuarioEditando.estado };
      dispatch(updateUsuario({ id: usuarioEditando.id, usuario: datosActualizados }));
    } else {
      dispatch(createUsuario(form));
    }
    limpiarFormulario();
  };

  const handleEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario);
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      fecha_nacimiento: usuario.fecha_nacimiento?.split("T")[0] || "",
      contrasena: "", // No se muestra
      genero: usuario.genero,
    });
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      dispatch(deleteUsuario(id));
    }
  };

  const handleEstado = (usuario) => {
    dispatch(toggleEstadoUsuario({ id: usuario.id, estado: !usuario.estado }));
  };

  return (
    <div className="role-list-container">
      <h2>Gestión de Usuarios</h2>
      <form className="create-role-form" onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="apellido" placeholder="Apellido" value={form.apellido} onChange={handleChange} required />
        <input name="correo" placeholder="Correo" type="email" value={form.correo} onChange={handleChange} required />
        <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} required />
        <input name="genero" placeholder="Género" value={form.genero} onChange={handleChange} required />
        {!modoEdicion && (
          <input name="contrasena" placeholder="Contraseña" type="password" value={form.contrasena} onChange={handleChange} required />
        )}
        <button className="btn" type="submit">{modoEdicion ? "Guardar Cambios" : "Crear Usuario"}</button>
        {modoEdicion && <button className="btn" type="button" onClick={limpiarFormulario}>Cancelar</button>}
      </form>

      {loading ? <p>Cargando usuarios...</p> : error ? <p>Error: {error}</p> : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Género</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.genero}</td>
                <td>
                  <button className="btn" onClick={() => handleEstado(usuario)}>
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td>
                  <button className="btn" onClick={() => handleEditar(usuario)}>Editar</button>
                  <button className="btn" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsuariosListPage;
