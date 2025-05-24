import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/UsuariosSuper.css';

const UsuariosSuper = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    fecha_nacimiento: '',
    contrasena: '',
    genero: '',
    rolid: '',
    estado: true,
    imagen: null
  });
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []); 

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://popnocturna.vercel.app/api/roles');
      setRoles(response.data);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      toast.error('Error al cargar los roles');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://popnocturna.vercel.app/api/usuarios');
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los usuarios');
      toast.error('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterRole(e.target.value);
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || usuario.rolid === parseInt(filterRole);
    return matchesSearch && matchesRole;
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      fecha_nacimiento: formatDateForInput(usuario.fecha_nacimiento),
      genero: usuario.genero,
      rolid: usuario.rolid,
      estado: usuario.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setSelectedUser(usuarios.find(u => u.id === id));
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://popnocturna.vercel.app/api/usuario/${selectedUser.id}`);
      toast.success('Usuario eliminado correctamente');
      setShowDeleteModal(false);
      fetchUsuarios();
    } catch (err) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'imagen') {
      setFormData(prev => ({ ...prev, imagen: files && files[0] ? files[0] : null }));
      setPreviewImg(files && files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser && !formData.imagen) {
      toast.error('La imagen es obligatoria');
      return;
    }
    if (!['Masculino', 'Femenino', 'Otro'].includes(formData.genero)) {
      toast.error('El género debe ser Masculino, Femenino u Otro');
      return;
    }
    if (!formData.rolid || isNaN(formData.rolid) || Number(formData.rolid) < 1) {
      toast.error('ID de rol inválido');
      return;
    }
    if (!selectedUser) {
      const erroresContrasena = validarContrasena(formData.contrasena);
      if (erroresContrasena.length > 0) {
        toast.error('Contraseña inválida: ' + erroresContrasena.join(' | '));
        return;
      }
    }
    try {
      if (selectedUser) {
        // Para actualización, enviar los datos como JSON
        const datosActualizados = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          fecha_nacimiento: formData.fecha_nacimiento,
          genero: formData.genero,
          estado: formData.estado,
          rolid: formData.rolid
        };

        // Si hay contraseña nueva, incluirla
        if (formData.contrasena) {
          datosActualizados.contrasena = formData.contrasena;
        }

        await axios.put(`https://popnocturna.vercel.app/api/usuario/${selectedUser.id}`, datosActualizados, {
          headers: { 'Content-Type': 'application/json' }
        });
        toast.success('Usuario actualizado correctamente');
      } else {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          data.append(key, value);
        });
        await axios.post('https://popnocturna.vercel.app/api/usuario', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Usuario creado correctamente');
      }
      setShowModal(false);
      setPreviewImg(null);
      fetchUsuarios();
    } catch (err) {
      toast.error('Error al guardar el usuario');
    }
  };

  const handleEstadoChange = async (id, estadoActual) => {
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/usuario/estado/${id}`, {
        estado: !estadoActual
      });
      toast.success(`Usuario ${!estadoActual ? 'activado' : 'desactivado'} correctamente`);
      fetchUsuarios();
    } catch (err) {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  const validarContrasena = (value) => {
    const errores = [];
    if (value.length < 8 || value.length > 20) {
      errores.push('Debe tener entre 8 y 20 caracteres');
    }
    if (!/[A-Z]/.test(value)) {
      errores.push('Debe incluir al menos una letra mayúscula');
    }
    if (!/\d/.test(value)) {
      errores.push('Debe incluir al menos un número');
    }
    if (!/[^A-Za-z\d]/.test(value)) {
      errores.push('Debe incluir al menos un símbolo (como !@#$%^&*)');
    }
    return errores;
  };

  if (loading) return <div className="super-loading">Cargando...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="super-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="super-header">
        <h1 className="super-title">Gestión de Usuarios</h1>
        <button 
          className="super-btn super-btn-primary"
          onClick={() => {
            setSelectedUser(null);
            setFormData({
              nombre: '',
              apellido: '',
              correo: '',
              fecha_nacimiento: '',
              contrasena: '',
              genero: '',
              rolid: '',
              estado: true,
              imagen: null
            });
            setShowModal(true);
          }}
        >
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <div className="super-filters">
        <div className="super-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearch}
            className="super-form-input"
          />
        </div>
        <div className="super-filter">
          <FaFilter className="filter-icon" />
          <select value={filterRole} onChange={handleFilter} className="super-form-select">
            <option value="all">Todos los roles</option>
            {roles.map(rol => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="super-table-container">
        <table className="super-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>{usuario.nombre}</span>
                  </div>
                </td>
                <td>{usuario.apellido}</td>
                <td>{usuario.correo}</td>
                <td>
                  <span className={`role-badge role-${usuario.rolid}`}>
                    {roles.find(r => r.id === usuario.rolid)?.nombre || 'Desconocido'}
                  </span>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={usuario.estado}
                      onChange={() => handleEstadoChange(usuario.id, usuario.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className={`status-badge ${usuario.estado ? 'active' : 'inactive'}`}>
                    {usuario.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="super-btn super-btn-icon"
                      onClick={() => handleEdit(usuario)}
                      title="Editar usuario"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="super-btn super-btn-icon super-btn-danger"
                      onClick={() => handleDelete(usuario.id)}
                      title="Eliminar usuario"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="super-modal">
          <div className="super-modal-content">
            <h2>{selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              {!selectedUser && (
                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Género</label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select
                  name="rolid"
                  value={formData.rolid}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {roles.map(rol => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Foto de perfil {selectedUser ? <span>(opcional)</span> : <span style={{color:'red'}}>*</span>}</label>
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChange}
                  className="super-form-input"
                  {...(!selectedUser ? { required: true } : {})}
                />
                {previewImg && (
                  <img
                    src={previewImg}
                    alt="Preview"
                    style={{maxWidth: 120, marginTop: 8, borderRadius: 8}}
                  />
                )}
              </div>
              <div className="form-group">
                <label>Estado</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="super-modal-actions">
                <button type="submit" className="super-btn super-btn-primary">
                  {selectedUser ? 'Actualizar' : 'Crear'}
                </button>
                <button 
                  type="button"
                  className="super-btn super-btn-secondary"
                  onClick={() => { setShowModal(false); setPreviewImg(null); }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="super-modal">
          <div className="super-modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar al usuario {selectedUser?.nombre}?</p>
            <div className="super-modal-actions">
              <button 
                className="super-btn super-btn-danger"
                onClick={confirmDelete}
              >
                <FaCheck /> Eliminar
              </button>
              <button 
                className="super-btn super-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosSuper;
