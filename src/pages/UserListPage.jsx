import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserListPage.css";

import { showSuccess, showError } from "../components/AlertManager";
import {
  getUsuarios,
  getUsuariosByRol,
  toggleUsuarioEstado,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "./api/usuarios";
import { api } from "./api/api";

const UserListPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuariosPorRol, setUsuariosPorRol] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    fecha_nacimiento: "",
    contrasena: "",
    genero: "",
    estado: true,
    rolid: "",
  });

  const [modoEdicionId, setModoEdicionId] = useState(null);
  const [edicionTemporal, setEdicionTemporal] = useState({});

  // Carga inicial de datos
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const usuariosData = await getUsuarios();
        const rolesRes = await api.get("/roles");

        if (isMounted) {
          setUsuarios(usuariosData);
          setRoles(rolesRes.data);

          if (rolesRes.data.length > 0) {
            const defaultRole = rolesRes.data[0].id;
            setActiveRole(defaultRole);
            setNuevoUsuario((prev) => ({ ...prev, rolid: defaultRole }));
            await cargarUsuariosPorRol(defaultRole);
          }
        }
      } catch {
        if (isMounted) showError("Error al cargar usuarios o roles.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const cargarUsuariosPorRol = async (rolId) => {
    try {
      const data = await getUsuariosByRol(rolId);
      setUsuariosPorRol((prev) => ({ ...prev, [rolId]: data }));
    } catch {
      showError("No se pudieron cargar los usuarios del rol.");
    }
  };

  const handleTabChange = (rolId) => {
    setActiveRole(rolId);
    if (!usuariosPorRol[rolId]) {
      cargarUsuariosPorRol(rolId);
    }
  };

  const handleInputChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCrearUsuario = async () => {
    const { nombre, correo, contrasena, rolid } = nuevoUsuario;

    if (!nombre || !correo || !contrasena || !rolid) {
      showError("Todos los campos son obligatorios, incluyendo el nombre y el rol.");
      return;
    }

    try {
      const creado = await crearUsuario(nuevoUsuario);
      const rolAsignado = roles.find((r) => r.id === creado.rolid);
      const usuarioConRol = { ...creado, rol: rolAsignado || { nombre: "Sin rol" } };

      setUsuarios((prev) => [...prev, usuarioConRol]);
      setUsuariosPorRol((prev) => ({
        ...prev,
        [rolid]: [...(prev[rolid] || []), usuarioConRol],
      }));

      showSuccess("Usuario creado correctamente.");

      setNuevoUsuario({
        nombre: "",
        apellido: "",
        correo: "",
        fecha_nacimiento: "",
        contrasena: "",
        genero: "",
        estado: true,
        rolid: activeRole || "",
      });
    } catch {
      showError("No se pudo crear el usuario.");
    }
  };

  const iniciarEdicion = (usuario) => {
    setModoEdicionId(usuario.id);
    setEdicionTemporal({ ...usuario });
  };

  const guardarEdicion = async (id) => {
    try {
      const updated = { ...edicionTemporal };

      if (!updated.rolid && updated.rol?.id) {
        updated.rolid = updated.rol.id;
      }

      await actualizarUsuario(id, updated);

      const updatedWithRol = {
        ...updated,
        rol: roles.find((r) => r.id === updated.rolid),
      };

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updatedWithRol } : u))
      );

      setModoEdicionId(null);
      setEdicionTemporal({});
      showSuccess("Usuario actualizado.");
    } catch {
      showError("Error al actualizar el usuario.");
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      await eliminarUsuario(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      await cargarUsuariosPorRol(activeRole);
      showSuccess("Usuario eliminado correctamente.");
    } catch {
      showError("Error al eliminar el usuario.");
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual;
      await toggleUsuarioEstado(id, nuevoEstado);

      const actualizarEstado = (lista) =>
        lista.map((u) => (u.id === id ? { ...u, estado: nuevoEstado } : u));

      setUsuarios((prev) => actualizarEstado(prev));
      setUsuariosPorRol((prev) => ({
        ...prev,
        [activeRole]: actualizarEstado(prev[activeRole] || []),
      }));

      showSuccess(`Usuario ${nuevoEstado ? "activado" : "desactivado"} correctamente.`);
    } catch (err) {
      console.error(err);
      showError("No se pudo cambiar el estado del usuario.");
    }
  };

  return (
    <div className="user-list-container">
      <div className="header-section">
        <h2 className="title">Usuarios</h2>
        <p className="subtitle">Consulta la lista de usuarios y roles registrados.</p>
      </div>

      {/* Crear nuevo usuario */}
      <div className="create-user-form mb-4">
        <h5>Crear nuevo usuario</h5>
        <div className="form-grid">
          <input name="nombre" placeholder="Nombre" value={nuevoUsuario.nombre} onChange={handleInputChange} />
          <input name="apellido" placeholder="Apellido" value={nuevoUsuario.apellido} onChange={handleInputChange} />
          <input name="correo" type="email" placeholder="Correo" value={nuevoUsuario.correo} onChange={handleInputChange} />
          <input name="fecha_nacimiento" type="date" value={nuevoUsuario.fecha_nacimiento} onChange={handleInputChange} />
          <input name="contrasena" type="password" placeholder="Contraseña" value={nuevoUsuario.contrasena} onChange={handleInputChange} />
          <input name="genero" placeholder="Género" value={nuevoUsuario.genero} onChange={handleInputChange} />
          <select name="rolid" value={nuevoUsuario.rolid} onChange={handleInputChange}>
            <option value="">Seleccione un rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>{rol.nombre}</option>
            ))}
          </select>
        </div>
        <button className="btn btn-secondary mt-2" onClick={handleCrearUsuario}>Crear</button>
      </div>

      {/* Tabla de usuarios */}
      <div className="list-user-form mb-4">
        <div className="table-section">
          <h4 className="section-title">Lista de Usuarios</h4>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    {modoEdicionId === usuario.id
                      ? <input value={edicionTemporal.nombre} onChange={(e) => setEdicionTemporal({ ...edicionTemporal, nombre: e.target.value })} />
                      : usuario.nombre}
                  </td>
                  <td>
                    {modoEdicionId === usuario.id
                      ? <input value={edicionTemporal.correo} onChange={(e) => setEdicionTemporal({ ...edicionTemporal, correo: e.target.value })} />
                      : usuario.correo}
                  </td>
                  <td>{usuario.rol?.nombre || "Sin rol"}</td>
                  <td>
                    <Switch
                      onChange={() => handleToggleEstado(usuario.id, usuario.estado)}
                      checked={usuario.estado}
                      onColor="#ffc107"
                      offColor="#dc3545"
                      checkedIcon={false}
                      uncheckedIcon={false}
                    />
                  </td>
                  <td>
                    {modoEdicionId === usuario.id ? (
                      <button className="btn btn-primary btn-sm me-2" onClick={() => guardarEdicion(usuario.id)}>Guardar</button>
                    ) : (
                      <button className="btn btn-secondary btn-sm me-2" onClick={() => iniciarEdicion(usuario)}>Editar</button>
                    )}
                    <button className="btn btn-warning btn-sm" onClick={() => handleEliminarUsuario(usuario.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usuarios por Rol */}
      <div className="roles-section mb-4">
        <h4 className="section-title">Usuarios por Rol</h4>
        <ul className="nav nav-tabs">
          {roles.map(({ id, nombre }) => (
            <li key={id} className="nav-item">
              <button className={`nav-link ${activeRole === id ? "active" : ""}`} onClick={() => handleTabChange(id)}>
                {nombre}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content mt-3">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              {(usuariosPorRol[activeRole] || []).map(({ id, nombre, correo }) => (
                <tr key={id}>
                  <td>{nombre}</td>
                  <td>{correo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
