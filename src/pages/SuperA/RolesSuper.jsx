import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/RolesSuper.css';

const RolesSuper = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    estado: true
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://popnocturna.vercel.app/api/roles');
      setRoles(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los roles');
      toast.error('Error al cargar los roles');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRoles = roles.filter(rol =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (rol) => {
    setSelectedRole(rol);
    setFormData({
      nombre: rol.nombre,
      estado: rol.estado
    });
    setShowModal(true);
  };

  const handleDelete = (rol) => {
    setSelectedRole(rol);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://popnocturna.vercel.app/api/rol/${selectedRole.id}`);
      toast.success('Rol eliminado correctamente');
      setShowDeleteModal(false);
      fetchRoles();
    } catch (err) {
      toast.error('Error al eliminar el rol');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRole) {
        await axios.put(`https://popnocturna.vercel.app/api/rol/${selectedRole.id}`, formData);
        toast.success('Rol actualizado correctamente');
      } else {
        await axios.post('https://popnocturna.vercel.app/api/rol', formData);
        toast.success('Rol creado correctamente');
      }
      setShowModal(false);
      fetchRoles();
    } catch (err) {
      toast.error('Error al guardar el rol');
    }
  };

  const handleEstadoChange = async (id, estadoActual) => {
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/rol/estado/${id}`, {
        estado: !estadoActual
      });
      toast.success(`Rol ${!estadoActual ? 'activado' : 'desactivado'} correctamente`);
      fetchRoles();
    } catch (err) {
      toast.error('Error al cambiar el estado del rol');
    }
  };

  if (loading) return <div className="super-loading">Cargando...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="container-roles">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="super-header">
        <h1 className="super-title">Gestión de Roles</h1>
        <button 
          className="super-btn super-btn-primary"
          onClick={() => {
            setSelectedRole(null);
            setFormData({ nombre: '', estado: true });
            setShowModal(true);
          }}
        >
          <FaPlus /> Nuevo Rol
        </button>
      </div>

      <div className="super-filters">
        <div className="super-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={handleSearch}
            className="super-form-input"
          />
        </div>
      </div>

      <div className="super-table-container">
        <table className="super-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuarios</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(rol => (
              <tr key={rol.id}>
                <td>
                  <div className="role-info">
                    <FaUsers className="role-icon" />
                    <span>{rol.nombre}</span>
                  </div>
                </td>
                <td>
                  <span className="users-count">
                    {rol.usuarios?.length || 0} usuarios
                  </span>
                </td>
                {/* <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={rol.estado}
                      onChange={() => handleEstadoChange(rol.id, rol.estado)}
                    />
                    <span className="slider"></span>
                  </label>
                  <span className={`status-badge ${rol.estado ? 'active' : 'inactive'}`}>
                    {rol.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td> */}
                <td>
                  <div className="action-buttons">
                    <button 
                      className="super-btn super-btn-icon"
                      onClick={() => handleEdit(rol)}
                      title="Editar rol"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="super-btn super-btn-icon super-btn-danger"
                      onClick={() => handleDelete(rol)}
                      title="Eliminar rol"
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

      {/* Modal de Edición/Creación */}
      {showModal && (
        <div className="super-modal">
          <div className="super-modal-content">
            <h2>{selectedRole ? 'Editar Rol' : 'Nuevo Rol'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre del Rol</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese el nombre del rol"
                />
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
                  {selectedRole ? 'Actualizar' : 'Crear'}
                </button>
                <button 
                  type="button"
                  className="super-btn super-btn-secondary"
                  onClick={() => setShowModal(false)}
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
            <p>¿Estás seguro de que deseas eliminar el rol {selectedRole?.nombre}?</p>
            <p className="warning-text">
              {selectedRole?.usuarios?.length > 0 
                ? `¡Advertencia! Este rol tiene ${selectedRole.usuarios.length} usuarios asignados.`
                : ''}
            </p>
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

export default RolesSuper; 