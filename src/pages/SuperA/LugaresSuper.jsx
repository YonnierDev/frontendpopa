import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import './styles/LugaresSuper.css';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevoLugar, setNuevoLugar] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    pais: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    fetchLugares();
  }, []);

  const fetchLugares = async () => {
    try {
      const response = await axios.get("https://popnocturna.vercel.app/api/lugares");
      setLugares(response.data);
    } catch (error) {
      console.error("Error al cargar lugares", error);
    }
  };

  const handleEditar = (lugar) => {
    setLugarSeleccionado(lugar);
    setModoEdicion(true);
    setNuevoLugar(lugar);
  };

  const handleGuardarEdicion = async () => {
    try {
      await axios.put(
        `https://popnocturna.vercel.app/api/lugar/${lugarSeleccionado.id}`,
        nuevoLugar
      );
      setMensaje("Lugar actualizado correctamente");
      fetchLugares();
      setLugarSeleccionado(null);
      setModoEdicion(false);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      console.error("Error al actualizar el lugar", error);
    }
  };

  const cambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await axios.patch(`https://popnocturna.vercel.app/api/lugar/estado/${id}`, {
        estado: nuevoEstado,
      });
      fetchLugares();
    } catch (error) {
      console.error("Error al cambiar estado del lugar", error);
    }
  };

  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const lugaresFiltrados = lugares.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLugar({ ...nuevoLugar, [name]: value });
  };

  const handleCrearLugar = (e) => {
    e.preventDefault();
    // Implementar la lógica para crear un nuevo lugar
  };

  const iniciarEdicion = (lugar) => {
    handleEditar(lugar);
  };

  const eliminarLugar = (id) => {
    // Implementar la lógica para eliminar un lugar
  };

  const cambiarEstadoLugar = (id, estadoActual) => {
    cambiarEstado(id, estadoActual);
  };

  const cerrarModal = () => {
    setLugarSeleccionado(null);
    setModoEdicion(false);
  };

  return (
    <div className="superadmin-lugares-contenedor">
      <div className="superadmin-lugares-formulario">
        <h2 className="superadmin-lugares-titulo">Lugares</h2>
        <div className="superadmin-lugares-formulario-titulo">
          <h3>{modoEdicion ? "Editar Lugar" : "Crear Lugar"}</h3>
        </div>
        <form onSubmit={handleCrearLugar} className="superadmin-lugares-form">
          <input type="text" name="nombre" placeholder="Nombre" value={nuevoLugar.nombre} onChange={handleChange} required className="superadmin-lugares-input" />
          <input type="text" name="direccion" placeholder="Dirección" value={nuevoLugar.direccion} onChange={handleChange} required className="superadmin-lugares-input" />
          <input type="text" name="ciudad" placeholder="Ciudad" value={nuevoLugar.ciudad} onChange={handleChange} required className="superadmin-lugares-input" />
          <input type="text" name="pais" placeholder="País" value={nuevoLugar.pais} onChange={handleChange} required className="superadmin-lugares-input" />
          <input type="text" name="telefono" placeholder="Teléfono" value={nuevoLugar.telefono} onChange={handleChange} className="superadmin-lugares-input" />
          <input type="email" name="email" placeholder="Email" value={nuevoLugar.email} onChange={handleChange} className="superadmin-lugares-input" />
          <button type="submit" className="superadmin-lugares-submit">{modoEdicion ? "Actualizar" : "Guardar"}</button>
        </form>
      </div>

      <input type="text" placeholder="Buscar lugar..." value={busqueda} onChange={handleBusqueda} className="superadmin-lugares-buscador" />

      <div className="superadmin-lugares-tabla-container">
        {mensaje && <p className="superadmin-lugares-mensaje">{mensaje}</p>}

        <h3 className="superadmin-lugares-subtitulo">Lista de Lugares</h3>

        <table className="superadmin-lugares-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Ciudad</th>
              <th>País</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {lugares
              .filter((lugar) => lugar.nombre.toLowerCase().includes(busqueda.toLowerCase()))
              .map((lugar) => (
                <tr key={lugar.id} className="superadmin-lugares-fila">
                  <td>{lugar.nombre}</td>
                  <td>{lugar.direccion}</td>
                  <td>{lugar.ciudad}</td>
                  <td>{lugar.pais}</td>
                  <td>{lugar.telefono || "No disponible"}</td>
                  <td>{lugar.email || "No disponible"}</td>
                  <td className="superadmin-lugares-acciones">
                    <button className="superadmin-lugares-editar" onClick={() => iniciarEdicion(lugar)}>Editar</button>
                    <button className="superadmin-lugares-eliminar" onClick={() => eliminarLugar(lugar.id)}>Eliminar</button>
                  </td>
                  <td>
                    <label className="superadmin-lugares-switch">
                      <input
                        type="checkbox"
                        checked={lugar.estado}
                        onChange={() => cambiarEstadoLugar(lugar.id, lugar.estado)}
                      />
                      <span className="superadmin-lugares-slider"></span>
                    </label>
                    <div className="superadmin-lugares-estado">
                      {lugar.estado ? "Activo" : "Inactivo"}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {lugarSeleccionado && (
        <div className="superadmin-lugares-modal">
          <div className="superadmin-lugares-modal-contenido">
            <h3>Detalles del Lugar</h3>
            <p><strong>Nombre:</strong> {lugarSeleccionado.nombre}</p>
            <p><strong>Dirección:</strong> {lugarSeleccionado.direccion}</p>
            <p><strong>Ciudad:</strong> {lugarSeleccionado.ciudad}</p>
            <p><strong>País:</strong> {lugarSeleccionado.pais}</p>
            <p><strong>Teléfono:</strong> {lugarSeleccionado.telefono || "No disponible"}</p>
            <p><strong>Email:</strong> {lugarSeleccionado.email || "No disponible"}</p>

            <button className="superadmin-lugares-cerrar-modal" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lugares;
