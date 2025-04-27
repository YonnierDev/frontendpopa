import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import './styles/UsuariosSuper.css';

const UsuariosSuper = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []); 

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('https://popnocturna.vercel.app/api/usuarios');
      const usuariosFormateados = response.data.map(usuario => ({
        id: usuario.id || '',
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        rol: usuario.rol || 'user',
        estado: usuario.estado || false
      }));
      setUsuarios(usuariosFormateados);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los usuarios');
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
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || usuario.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (usuario) => {
    setSelectedUser(usuario);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`https://popnocturna.vercel.app/api/usuario/${id}`);
        fetchUsuarios();
      } catch (err) {
        setError('Error al eliminar el usuario');
      }
    }
  };

  if (loading) return <div className="super-loading">Cargando...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="super-container">
      <div className="super-header">
        <h1 className="super-title">Gestión de Usuarios</h1>
        <button className="super-btn super-btn-primary">
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
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
        </div>
      </div>

      <div className="super-table-container">
        <table className="super-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>
                  <div className="user-info">
                    <FaUser className="user-icon" />
                    <span>{usuario.nombre || 'Sin nombre'}</span>
                  </div>
                </td>
                <td>{usuario.email || 'Sin email'}</td>
                <td>
                  <span className={`role-badge ${usuario.rol || 'user'}`}>
                    {usuario.rol || 'user'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${usuario.estado ? 'active' : 'inactive'}`}>
                    {usuario.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="super-btn super-btn-icon"
                      onClick={() => handleEdit(usuario)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="super-btn super-btn-icon super-btn-danger"
                      onClick={() => handleDelete(usuario.id)}
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
            <h2>Editar Usuario</h2>
            {/* Formulario de edición aquí */}
            <div className="super-modal-actions">
              <button className="super-btn super-btn-primary">Guardar</button>
              <button 
                className="super-btn super-btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosSuper;
