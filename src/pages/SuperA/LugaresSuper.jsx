import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch, FaEdit, FaTrash, FaMapMarkerAlt, FaFilter, FaImage, FaCheck, FaTimes } from 'react-icons/fa';
import './styles/LugaresSuper.css';

const LugaresSuper = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLugar, setSelectedLugar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    categoriaid: '',
    usuarioid: '',
    estado: false,
    aprobacion: false
  });
  const [imagen, setImagen] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
const [imagenModal, setImagenModal] = useState({ visible: false, url: '', descripcion: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario || (usuario.rol !== 1 && usuario.rol !== 2)) {
      setError('No tienes permisos para acceder a esta página');
      return;
    }

    // Establecer el usuarioid del usuario actual
    setFormData(prev => ({
      ...prev,
      usuarioid: usuario.id
    }));

    fetchLugares();
  }, []);

  const fetchLugares = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await axios.get('https://popnocturna.vercel.app/api/lugares', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setLugares(response.data);
        console.log('Lugares actualizados:', response.data);
      } else {
        console.error('Formato de respuesta inválido:', response.data);
        setError('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.mensaje || 'Error al cargar los lugares');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLugares = lugares.filter(lugar =>
    lugar.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (lugar) => {
    setSelectedLugar(lugar);
    setFormData({
      nombre: lugar.nombre || '',
      descripcion: lugar.descripcion || '',
      ubicacion: lugar.ubicacion || '',
      categoriaid: lugar.categoriaid || '',
      usuarioid: lugar.usuarioid || '',
      estado: lugar.estado,
      aprobacion: lugar.aprobacion
    });
    setPreviewUrl(lugar.imagen || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este lugar?')) {
      try {
        const token = localStorage.getItem('token');
        console.log('Eliminando lugar:', id);

        const response = await axios.delete(`https://popnocturna.vercel.app/api/lugar/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Respuesta eliminación:', response.data);

        // Actualizar la lista local eliminando el lugar
        setLugares(prevLugares => {
          const newLugares = prevLugares.filter(lugar => lugar.id !== id);
          console.log('Nueva lista de lugares:', newLugares);
          return newLugares;
        });

        toast.success('Lugar eliminado correctamente');
        // Forzar una recarga completa
        await fetchLugares();
      } catch (error) {
        console.error('Error completo:', error);
        console.error('Error response:', error.response);
        toast.error(error.response?.data?.mensaje || 'Error al eliminar el lugar');
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      console.log('Usuario actual:', usuario);

      const formDataToSend = new FormData();
      
      // Asegurarnos de que todos los campos necesarios estén presentes
      const dataToSend = {
        ...formData,
        usuarioid: usuario.id
      };

      console.log('Datos a enviar:', dataToSend);

      // Agregar todos los campos al FormData
      Object.keys(dataToSend).forEach(key => {
        formDataToSend.append(key, dataToSend[key]);
      });

      if (imagen) {
        formDataToSend.append('imagen', imagen);
      }

      let response;
      if (selectedLugar) {
        console.log('Actualizando lugar:', selectedLugar.id);
        response = await axios.put(`https://popnocturna.vercel.app/api/lugar/${selectedLugar.id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Respuesta actualización:', response.data);
        toast.success('Lugar actualizado correctamente');
      } else {
        console.log('Creando nuevo lugar');
        response = await axios.post('https://popnocturna.vercel.app/api/lugar', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Respuesta creación:', response.data);
        toast.success('Lugar creado correctamente');
      }

      // Actualizar la lista de lugares con la respuesta del servidor
      if (response.data && response.data.lugar) {
        const lugarActualizado = response.data.lugar;
        console.log('Lugar actualizado/creado:', lugarActualizado);
        setLugares(prevLugares => {
          const newLugares = selectedLugar
            ? prevLugares.map(lugar => lugar.id === lugarActualizado.id ? lugarActualizado : lugar)
            : [...prevLugares, lugarActualizado];
          console.log('Nueva lista de lugares:', newLugares);
          return newLugares;
        });
      }

      setShowModal(false);
      // Forzar una recarga completa
      await fetchLugares();
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.mensaje || 'Error al guardar el lugar');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggleEstado = async (lugar) => {
    const nuevoEstado = !lugar.estado;

    // Optimistic UI update for a faster user experience
    const originalLugares = [...lugares];
    setLugares(prevLugares =>
      prevLugares.map(l =>
        l.id === lugar.id ? { ...l, estado: nuevoEstado } : l
      )
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://popnocturna.vercel.app/api/lugar/${lugar.id}/estado`,
        { estado: nuevoEstado },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success(`Estado del lugar actualizado a ${nuevoEstado ? 'Activo' : 'Inactivo'}.`);
    } catch (error) {
      // Revert the state on error
      setLugares(originalLugares);
      console.error('Error al actualizar el estado:', error.response?.data?.mensaje || error.message);
      toast.error('Error al actualizar el estado del lugar.');
    }
  };



  const handleToggleAprobacion = async (lugar, aprobacion) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`https://popnocturna.vercel.app/api/lugar/aprobacion/${lugar.id}`, {
        aprobacion: aprobacion
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.data.lugar) {
        setLugares(prevLugares => prevLugares.map(lugar =>
          lugar.id === lugar.id ? { ...lugar, aprobacion: aprobacion } : lugar
        ));
        toast.success(aprobacion ? 'Lugar aprobado' : 'Lugar marcado como pendiente');
      }
    } catch (error) {
      toast.error('No se pudo cambiar la aprobación');
    }
  };

  if (loading) return <div className="super-loading">Cargando lugares...</div>;
  if (error) return <div className="super-alert super-alert-error">{error}</div>;

  return (
    <div className="lugares-container">
      <div className="lugares-header">
        <h1 className="lugares-title" title="Gestión de Lugares">Gestión de Lugares</h1>
        <div className="lugares-header-actions">
          <button 
            className="lugares-btn lugares-btn-primary"
            onClick={() => {
              setSelectedLugar(null);
              setFormData({
                nombre: '',
                descripcion: '',
                ubicacion: '',
                categoriaid: '',
                usuarioid: JSON.parse(localStorage.getItem('usuario')).id,
                estado: false,
                aprobacion: false
              });
              setImagen(null);
              setPreviewUrl('');
              setShowModal(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <span>+</span> Nuevo Lugar
          </button>
        </div>
      </div>

      <div className="lugares-search-container">
        <div className="lugares-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="lugares-form-input"
            placeholder="Buscar lugares..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="lugares-table-container">
        <div className="lugares-table-wrapper">
          <table className="lugares-table">
            <thead>
              <tr>
                <th style={{ width: '70px', minWidth: '64px', maxWidth: '80px', verticalAlign: 'middle', padding: '12px 8px' }}>Imagen</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Aprobación</th>
                <th>Acciones</th>
              </tr>
            </thead>
          <tbody>
            {filteredLugares.length === 0 ? (
              <tr>
                <td colSpan="7" className="lugares-no-data">
                  No hay lugares disponibles
                </td>
              </tr>
            ) : (
              filteredLugares.map(lugar => (
                <tr key={lugar.id}>
                  <td style={{ width: '70px', minWidth: '64px', maxWidth: '80px', verticalAlign: 'middle', textAlign: 'center', padding: '12px 8px' }}>
  <div className="lugar-imagen">
    {lugar.imagen ? (
      <img 
        src={lugar.imagen} 
        alt={lugar.nombre}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#fff', borderRadius: '6px', cursor: 'pointer' }}
        onClick={() => setImagenModal({ visible: true, url: lugar.imagen, descripcion: lugar.descripcion })}
        onError={(e) => {
          e.target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = 'no-imagen';
          fallback.innerHTML = '<svg width="28" height="28" fill="#adb5bd"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="18">?</text></svg>';
          e.target.parentNode.appendChild(fallback);
        }}
      />
    ) : (
      <div className="no-imagen">
        <FaImage />
      </div>
    )}
  </div>
</td>
                  <td className="lugar-nombre">
  <div className="lugar-info">
    <h3 title={lugar.nombre}>{lugar.nombre}</h3>
    <p title={lugar.descripcion}>{lugar.descripcion}</p>
  </div>
</td>
                  <td style={{ minWidth: '150px' }}>
                    <div className="lugar-info" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <FaMapMarkerAlt className="lugar-icon" style={{ color: '#6c757d', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem' }}>{lugar.ubicacion}</span>
                    </div>
                  </td>
                  <td className="lugar-categoria" style={{ minWidth: '120px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '50px',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      fontSize: '0.85rem',
                      textAlign: 'center'
                    }}>
                      {lugar.categoria?.tipo || 'Sin categoría'}
                    </span>
                  </td>
                  <td style={{ minWidth: '150px' }}>
                    <div className="lugar-status-column" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span 
                        className={`lugar-status-badge ${lugar.estado ? 'active' : 'inactive'}`}
                        title={lugar.estado ? 'Activo' : 'Inactivo'}
                      >
                        {lugar.estado ? 'Activo' : 'Inactivo'}
                      </span>
                      <label className="lugar-switch" style={{ margin: 0 }}>
                        <input
                        type="checkbox"
                        checked={lugar.estado}
                        onChange={() => handleToggleEstado(lugar)}
                        aria-label={`Cambiar estado a ${lugar.estado ? 'inactivo' : 'activo'}`}
                      />  
                        <span className="lugar-slider"></span>
                      </label>
                    </div>
                  </td>
                  <td>
  <div className="lugar-aprobacion-btns">
    <span 
      className={`lugar-status-badge ${lugar.aprobacion ? 'active' : 'inactive'}`}
      title={lugar.aprobacion ? 'Aprobado' : 'Pendiente'}
      style={{ minWidth: 70 }}
    >
      {lugar.aprobacion ? 'Aprobado' : 'Pendiente'}
    </span>
    <button
      className="lugar-aprobacion-btn aprobar"
      title="Aprobar"
      style={{ opacity: lugar.aprobacion ? 0.5 : 1 }}
      disabled={lugar.aprobacion}
      onClick={() => handleToggleAprobacion(lugar.id, true)}
    >
      <FaCheck />
    </button>
    <button
      className="lugar-aprobacion-btn noaprobar"
      title="Rechazar"
      style={{ opacity: !lugar.aprobacion ? 0.5 : 1 }}
      disabled={!lugar.aprobacion}
      onClick={() => handleToggleAprobacion(lugar.id, false)}
    >
      <FaTimes />
    </button>
  </div>
</td>
                  <td style={{ minWidth: '180px' }}>
                    <div className="lugares-actions">
                      <button
                        className="lugares-btn lugares-btn-secondary"
                        onClick={() => handleEdit(lugar)}
                        title="Editar lugar"
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FaEdit /> <span>Editar</span>
                      </button>
                      <button
                        className="lugares-btn lugares-btn-danger"
                        onClick={() => handleDelete(lugar.id)}
                        title="Eliminar lugar"
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.85rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FaTrash /> <span>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="lugares-modal">
          <div className="lugares-modal-content">
            <h2>{selectedLugar ? 'Editar Lugar' : 'Nuevo Lugar'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-scrollable">
                <div className="lugares-form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="lugares-form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="lugares-form-group">
                  <label htmlFor="ubicacion">Ubicación</label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="lugares-form-group">
                  <label htmlFor="categoriaid">Categoría</label>
                  <select
                    id="categoriaid"
                    name="categoriaid"
                    value={formData.categoriaid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una categoría</option>
                    <option value="13">Canchas Sintéticas</option>
                    <option value="14">Discotecas</option>
                    <option value="15">Restaurantes</option>
                    <option value="16">Comidas Rápidas</option>
                    <option value="19">Acampar-Glamplig</option>
                    <option value="22">Bares</option>
                  </select>
                </div>
                <div className="lugares-form-group">
                  <label htmlFor="imagen">Imagen</label>
                  <input
                    type="file"
                    id="imagen"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!selectedLugar}
                  />
                  {previewUrl && (
                    <div className="lugares-image-preview">
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
                </div>
                <div className="lugares-form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="estado"
                      checked={formData.estado}
                      onChange={handleChange}
                    />
                    Activo
                  </label>
                </div>
                <div className="lugares-form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="aprobacion"
                      checked={formData.aprobacion}
                      onChange={handleChange}
                    />
                    Aprobado
                  </label>
                </div>
              </div>
              <div className="lugares-modal-actions">
                <button
                  type="button"
                  className="lugares-btn lugares-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="lugares-btn lugares-btn-primary"
                >
                  {selectedLugar ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LugaresSuper;
