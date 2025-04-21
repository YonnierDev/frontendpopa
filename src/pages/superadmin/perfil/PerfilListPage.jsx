import { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { obtenerPerfil, actualizarPerfil } from '../../../store/perfil/perfilSlice'; // Asegúrate de que sea el slice correcto


const PerfilListPage = () => {
  const dispatch = useDispatch();
  const { perfil, loading, error } = useSelector((state) => state.perfil); // Ajusta el path si es necesario
  const [perfilData, setPerfilData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    fecha_nacimiento: "",
    genero: "",
  });
  const [imagen, setImagen] = useState(null);

  // Cargar el perfil cuando el componente se monta
  useEffect(() => {
    dispatch(obtenerPerfil());  // Despachamos la acción para obtener el perfil
  }, [dispatch]);

  useEffect(() => {
    if (perfil) {
      // Agregar console.log para revisar los datos recibidos
      console.log("Datos del perfil:", perfil);

      // Formatear fecha_nacimiento a 'YYYY-MM-DD' si existe
      const formattedDate = perfil.fecha_nacimiento
        ? new Date(perfil.fecha_nacimiento).toISOString().split('T')[0]
        : "";

      setPerfilData({
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
        correo: perfil.correo || "",
        fecha_nacimiento: formattedDate,  // Asegurarse de que esté en el formato adecuado
        genero: perfil.genero || "",
      });
    }
  }, [perfil]);

  const handleFileChange = (event) => {
    setImagen(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!perfilData.nombre || !perfilData.apellido || !perfilData.correo) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append("nombre", perfilData.nombre);
    formData.append("apellido", perfilData.apellido);
    formData.append("correo", perfilData.correo);
    formData.append("fecha_nacimiento", perfilData.fecha_nacimiento);
    formData.append("genero", perfilData.genero);

    if (imagen) {
      formData.append("imagen", imagen);  // Agregar la imagen al FormData
    }

    dispatch(actualizarPerfil(formData));  // Disparamos la acción para actualizar el perfil
  };

  return (
    <div className="perfil-container">
      <h1>Actualizar Perfil</h1>
      {error && <div className="error-message">{error}</div>} {/* Muestra el error si hay */}
      {loading && <div className="loading-message">Cargando...</div>} {/* Muestra loading mientras se espera la respuesta */}

      <div className="perfil-header">
        {/* Imagen de perfil */}
        <div className="perfil-img-container">
          <img 
            className="perfil-img" 
            src={perfil?.imagen || "default-avatar.png"} 
            alt="Imagen de perfil" 
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="perfil-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              value={perfilData.nombre}
              onChange={(e) => setPerfilData({ ...perfilData, nombre: e.target.value })}
              placeholder="Nombre"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              value={perfilData.apellido}
              onChange={(e) => setPerfilData({ ...perfilData, apellido: e.target.value })}
              placeholder="Apellido"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              value={perfilData.correo}
              onChange={(e) => setPerfilData({ ...perfilData, correo: e.target.value })}
              placeholder="Correo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="fecha_nacimiento"
              value={perfilData.fecha_nacimiento || ""} // Asegurarse de que no sea undefined
              onChange={(e) => setPerfilData({ ...perfilData, fecha_nacimiento: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="genero">Género:</label>
            <input
              type="text"
              id="genero"
              value={perfilData.genero || ""} // Asegurarse de que no sea undefined
              onChange={(e) => setPerfilData({ ...perfilData, genero: e.target.value })}
              placeholder="Género"
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen de perfil:</label>
            <input type="file" id="imagen" onChange={handleFileChange} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Actualizando..." : "Actualizar perfil"}
        </button>
      </form>
    </div>
  );
};

export default PerfilListPage;
