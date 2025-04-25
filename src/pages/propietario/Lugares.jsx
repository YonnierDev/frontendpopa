import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lugares.css';
import { FaPlus, FaEdit, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const Lugares = () => {
  const navigate = useNavigate();
  const [lugares, setLugares] = useState([]);
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

        // Primero intentamos obtener las categorías
        const categoriasRes = await fetch('https://popnocturna.vercel.app/api/categorias');
        if (!categoriasRes.ok) {
          throw new Error('Error al cargar categorías');
        }
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData);

        // Luego intentamos obtener los lugares
        const obtenerLugares = async () => {
          const lugaresRes = await fetch('https://popnocturna.vercel.app/api/propietario/lugares', {
            headers: {
              'Authorization': `Bearer ${usuario.token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!lugaresRes.ok) {
            if (lugaresRes.status === 404) {
              setLugares([]);
              return;
            }
            throw new Error('Error al cargar lugares');
          }

          const lugaresData = await lugaresRes.json();
          setLugares(lugaresData);
        };

        // Cargar lugares inicialmente
        await obtenerLugares();

        // Configurar intervalo para actualizar lugares cada 30 segundos
        const intervalo = setInterval(obtenerLugares, 30000);

        // Limpiar intervalo cuando el componente se desmonte
        return () => clearInterval(intervalo);

      } catch (error) {
        console.error('Error detallado:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (!usuario || !usuario.token) {
        console.log('No hay token disponible, redirigiendo a login');
        navigate('/login');
        return;
      }

      console.log('Datos del formulario:', formData);

      const formDataToSend = new FormData();
      formDataToSend.append('categoriaid', formData.categoriaid);
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('ubicacion', formData.ubicacion);
      formDataToSend.append('imagen', formData.imagen);
      // Ya no enviamos el usuarioid ni el estado, el backend los maneja

      console.log('Token usado:', usuario.token);
      console.log('ID del usuario:', usuario.id);  
      console.log('Enviando datos a la API...');

      const response = await fetch('https://popnocturna.vercel.app/api/propietario/lugar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${usuario.token}`
        },
        body: formDataToSend
      });

      console.log('Respuesta de la API:', response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Error response:', responseText);
        
        if (response.status === 401) {
          localStorage.removeItem('usuario');
          navigate('/login');
          throw new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
        }

        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.mensaje || 'Error al crear el lugar');
        } catch (parseError) {
          throw new Error(`Error al crear el lugar: ${response.status} ${response.statusText}`);
        }
      }

      const responseText = await response.text();
      console.log('Respuesta exitosa:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Respuesta del servidor:', data);
        
        if (!data.lugar || !data.lugar.id) {
          console.error('El lugar creado no tiene la estructura correcta:', data);
          throw new Error('Error al procesar la respuesta del servidor');
        }
        
        // Actualizar la lista de lugares con el lugar devuelto por el servidor
        setLugares(prev => [...prev, data.lugar]);
        setShowModal(false);
        setFormData({
          categoriaid: '',
          nombre: '',
          descripcion: '',
          ubicacion: '',
          imagen: null
        });
      } catch (parseError) {
        console.error('Error al parsear respuesta:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al crear lugar:', error);
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="lugares-container">
          <div className="lugares-header">
            <h2>Mis Lugares</h2>
            <button 
              className="btn-crear"
              onClick={() => setShowModal(true)}
            >
              <FaPlus /> Crear Nuevo Lugar
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  cargarDatos();
                }} 
                className="btn-retry"
              >
                Intentar de nuevo
              </button>
            </div>
          )}

          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h3>Crear Nuevo Lugar</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select
                      name="categoriaid"
                      value={formData.categoriaid}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="">Selecciona una categoría</option>
                      {categorias.map(categoria => (
                        <option key={categoria.id} value={categoria.id}>
                          {categoria.tipo}
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
                    <div className="image-upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                      />
                      {formData.imagen && (
                        <div className="image-preview">
                          <img 
                            src={URL.createObjectURL(formData.imagen)} 
                            alt="Preview" 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-buttons">
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancelar
                    </button>
                    <button type="submit">
                      Crear Lugar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="lugares-grid">
            {lugares.map((lugar) => (
              <div key={lugar.id} className="lugar-card">
                <div className="lugar-imagen">
                  <img 
                    src={lugar.imagen} 
                    alt={lugar.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://res.cloudinary.com/popaimagen/image/upload/v1744615116/default-place.jpg';
                    }}
                  />
                  <div className={`estado-badge ${lugar.estado}`}>
                    {lugar.estado === 'activo' ? (
                      <><FaCheckCircle /> Activo</>
                    ) : (
                      <><FaTimesCircle /> Inactivo</>
                    )}
                  </div>
                </div>
                <div className="lugar-info">
                  <h3>{lugar.nombre}</h3>
                  <p>{lugar.descripcion}</p>
                  <div className="lugar-ubicacion">
                    <FaMapMarkerAlt /> {lugar.ubicacion}
                  </div>
                  <div className="lugar-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => navigate(`/propietario/lugar/${lugar.id}`)}
                    >
                      <FaEdit /> Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lugares;
