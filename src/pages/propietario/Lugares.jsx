import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lugares.css';
import { FaPlus, FaEdit, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const Lugares = () => {
  const navigate = useNavigate();
  const [lugares, setLugares] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    categoriaid: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    imagen: null,
    estado: 'inactivo'
  });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        if (!usuario) {
          navigate('/login');
          return;
        }

        // Cargar categorías
        const categoriasRes = await fetch('https://popnocturna.vercel.app/api/categorias');
        if (!categoriasRes.ok) {
          throw new Error('Error al cargar categorías');
        }
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData);

        // Cargar lugares del propietario
        const lugaresRes = await fetch('https://popnocturna.vercel.app/api/propietario/lugares', {
          headers: {
            'Authorization': `Bearer ${usuario.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!lugaresRes.ok) {
          if (lugaresRes.status === 404) {
            setLugares([]);
          } else {
            throw new Error('Error al cargar los lugares');
          }
        } else {
          const lugaresData = await lugaresRes.json();
          setLugares(lugaresData);
        }

        // Cargar comentarios
        const comentariosRes = await fetch('https://popnocturna.vercel.app/api/comentarios', {
          headers: {
            'Authorization': `Bearer ${usuario.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (comentariosRes.ok) {
          const comentariosData = await comentariosRes.json();
          setComentarios(comentariosData);
        } else {
          setComentarios([]);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        imagen: e.target.files[0]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const formDataToSend = new FormData();
      
      formDataToSend.append('categoriaid', formData.categoriaid);
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('estado', formData.estado);
      
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      const response = await fetch('https://popnocturna.vercel.app/api/lugares', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Error al crear el lugar');
      }

      // Recargar la lista de lugares
      const nuevosLugares = await fetch('https://popnocturna.vercel.app/api/propietario/lugares', {
        headers: {
          'Authorization': `Bearer ${usuario.token}`,
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());

      setLugares(nuevosLugares);
      setShowModal(false);
      setFormData({
        categoriaid: '',
        nombre: '',
        descripcion: '',
        ubicacion: '',
        imagen: null,
        estado: 'inactivo'
      });

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="lugares-container">
        <Sidebar />
        <div className="lugares-content">
          <h2>Cargando lugares...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lugares-container">
        <Sidebar />
        <div className="lugares-content">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lugares-container">
      <Sidebar />
      <div className="lugares-content">
        <div className="lugares-header">
          <h2>Mis Lugares</h2>
          <button 
            className="btn-nuevo-lugar"
            onClick={() => setShowModal(true)}
          >
            <FaPlus /> Nuevo Lugar
          </button>
        </div>

        <div className="lugares-grid">
          {lugares.map((lugar) => (
            <div key={lugar.id} className="lugar-card">
              <div className="lugar-imagen">
                {lugar.imagen ? (
                  <img 
                    src={`https://popnocturna.vercel.app/uploads/${lugar.imagen}`} 
                    alt={lugar.nombre} 
                  />
                ) : (
                  <div className="sin-imagen">
                    <FaMapMarkerAlt size={40} />
                  </div>
                )}
              </div>
              <div className="lugar-info">
                <h3>{lugar.nombre}</h3>
                <p>{lugar.descripcion}</p>
                <div className="lugar-estado">
                  Estado: {lugar.estado === 'activo' ? (
                    <span className="activo"><FaCheckCircle /> Activo</span>
                  ) : (
                    <span className="inactivo"><FaTimesCircle /> Inactivo</span>
                  )}
                </div>
                <button 
                  className="btn-editar"
                  onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}
                >
                  <FaEdit /> Editar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal para crear nuevo lugar */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Crear Nuevo Lugar</h3>
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Categoría</label>
                  <select
                    name="categoriaid"
                    value={formData.categoriaid}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Imagen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancelar"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-guardar">
                    Guardar Lugar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lugares;
