<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Badge, Form } from "react-bootstrap";
import {
  fetchUsuarios,
  updateUsuario,
  createUsuario,
  deleteUsuario,
  toggleEstadoUsuario,
} from "../../../store/usuarios/usuariosSlice";
import { selectUsuariosFiltrados } from "../../../components/selector/usuarios/selectUsuariosFiltrados";
import { showError, showSuccess } from "../../../components/alert/AlertManager";
import UsuarioModal from "../../../components/modal/usuarios/UsuarioModal";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import "../styles/SuperAdmin.css";

const UsuariosListPage = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.usuarios);
  const usuarios = useSelector(selectUsuariosFiltrados);

=======
import "./UsuariosListPage.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsuarios, createUsuario, updateUsuario, deleteUsuario, toggleEstadoUsuario} from "../../../store/usuarios/usuariosSlice";

const UsuariosListPage = () => {
  console.log("👉 Cargando UsuariosListPage"); // Este log te va a confirmar si entra
  const dispatch = useDispatch();
  const { usuarios, loading, error } = useSelector((state) => state.usuarios);
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
<<<<<<< HEAD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsuarios())
      .unwrap()
      .catch((err) => showError(`Error al cargar usuarios: ${err}`));
=======

  useEffect(() => {
    dispatch(fetchUsuarios());
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
<<<<<<< HEAD
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && usuarioEditando) {
        const datosActualizados = {
          ...form,
          rolid: usuarioEditando.rolid,
          estado: usuarioEditando.estado,
        };
        await dispatch(updateUsuario({ id: usuarioEditando.id, usuario: datosActualizados })).unwrap();
        showSuccess("Usuario actualizado correctamente.");
      } else {
        await dispatch(createUsuario(form)).unwrap();
        showSuccess("Usuario creado correctamente.");
      }
      limpiarFormulario();
    } catch (err) {
      showError(`Error al ${modoEdicion ? "actualizar" : "crear"} usuario: ${err}`);
    }
=======
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
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
  };

  const handleEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario);
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      fecha_nacimiento: usuario.fecha_nacimiento?.split("T")[0] || "",
<<<<<<< HEAD
      contrasena: "",
      genero: usuario.genero,
    });
    setIsModalOpen(true);
  };

  const handleCrear = () => {
    limpiarFormulario();
    setIsModalOpen(true);
  };

  const handleEstado = async (usuario) => {
    try {
      const nuevoEstado = !usuario.estado;
      await dispatch(toggleEstadoUsuario({ id: usuario.id, estado: nuevoEstado })).unwrap();
      await dispatch(fetchUsuarios());
      showSuccess(`Usuario ${nuevoEstado ? "activado" : "desactivado"} correctamente.`);
    } catch (err) {
      showError(`Error al cambiar el estado del usuario: ${err}`);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await dispatch(deleteUsuario(id)).unwrap();
      showSuccess("Usuario eliminado correctamente.");
    } catch (err) {
      showError(`Error al eliminar el usuario: ${err}`);
    }
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-container">
      <div className="header-section">
        <h2 className="title">Usuarios</h2>
        <p className="subtitle">Gestiona los usuarios disponibles en el sistema.</p>
        <div className="actions">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="btn btn-danger" onClick={handleCrear}>
            <FaUserPlus /> Crear Usuario
          </button>
        </div>
      </div>

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={limpiarFormulario}
        onSubmit={handleSubmit}
        form={form}
        handleChange={handleChange}
        modoEdicion={modoEdicion}
      />

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table className="styled-table compact">
=======
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
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
<<<<<<< HEAD
            {usuariosFiltrados.map((usuario) => (
=======
            {usuarios.map((usuario) => (
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.genero}</td>
                <td>
<<<<<<< HEAD
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={usuario.estado}
                      onChange={() => handleEstado(usuario)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
                <td className="acciones">
                  <button className="btn btn-edit" onClick={() => handleEditar(usuario)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-delete" onClick={() => handleEliminar(usuario.id)}>
                    <FaTrash />
                  </button>
=======
                  <button className="btn" onClick={() => handleEstado(usuario)}>
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td>
                  <button className="btn" onClick={() => handleEditar(usuario)}>Editar</button>
                  <button className="btn" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
