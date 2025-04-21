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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsuarios())
      .unwrap()
      .catch((err) => showError(`Error al cargar usuarios: ${err}`));
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
  };

  const handleEditar = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario);
    setForm({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      fecha_nacimiento: usuario.fecha_nacimiento?.split("T")[0] || "",
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
            {usuariosFiltrados.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nombre}</td>
                <td>{usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.genero}</td>
                <td>
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
