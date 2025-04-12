import './LugarListPage.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLugares,
  createLugar,
  updateLugar,
  deleteLugar,
  toggleEstadoLugar,
} from '../../../store/lugares/lugaresSlice';
import { fetchUsuarios } from '../../../store/usuarios/usuariosSlice';
import { fetchCategorias } from '../../../store/categorias/categoriasSlice';
import { showSuccess, showError, showInfo } from '../../../components/alert/AlertManager';

const LugaresListPage = () => {
  const dispatch = useDispatch();
  const { lugares, loading, error } = useSelector((state) => state.lugares);
  const { usuarios } = useSelector((state) => state.usuarios);
  const { categorias } = useSelector((state) => state.categorias);

  const [formData, setFormData] = useState({
    usuarioid: '',
    categoriaid: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
  });

  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    dispatch(fetchLugares());
    dispatch(fetchUsuarios());
    dispatch(fetchCategorias());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await dispatch(updateLugar({ id: editandoId, datos: formData })).unwrap();
        showSuccess('Lugar actualizado correctamente');
      } else {
        await dispatch(createLugar(formData)).unwrap();
        showSuccess('Lugar creado exitosamente');
      }
      setFormData({ usuarioid: '', categoriaid: '', nombre: '', descripcion: '', ubicacion: '' });
      setEditandoId(null);
    } catch (err) {
      showError('Error al guardar el lugar', err);
    }
  };

  const handleEdit = (lugar) => {
    setEditandoId(lugar.id);
    setFormData({
      usuarioid: lugar.usuarioid,
      categoriaid: lugar.categoriaid,
      nombre: lugar.nombre,
      descripcion: lugar.descripcion,
      ubicacion: lugar.ubicacion,
    });
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este lugar?')) {
      try {
        await dispatch(deleteLugar(id)).unwrap();
        showInfo('Lugar eliminado correctamente');
      } catch (err) {
        showError('Error al eliminar el lugar', err);
      }
    }
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      await dispatch(toggleEstadoLugar({ id, estado: !estadoActual })).unwrap();
      showSuccess(`Lugar ${estadoActual ? 'desactivado' : 'activado'} correctamente`);
    } catch (err) {
      showError('Error al cambiar el estado del lugar', err);
    }
  };

  return (
    <div className="lugar-list-container">
      <div className="header-section">
        <h2 className="title">{editandoId ? 'Editar Lugar' : 'Crear Lugar'}</h2>
        <p className="subtitle">Gestión de lugares del sistema</p>
      </div>

      <form className="create-role-form" onSubmit={handleSubmit}>
        <select name="usuarioid" value={formData.usuarioid} onChange={handleChange} required>
          <option value="">Seleccione un usuario</option>
          {usuarios.map((user) => (
            <option key={user.id} value={user.id}>{user.nombre}</option>
          ))}
        </select>

        <select name="categoriaid" value={formData.categoriaid} onChange={handleChange} required>
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.tipo}</option>
          ))}
        </select>

        <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre del lugar" required />
        <input name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción" required />
        <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Ubicación" required />

        <button className="btn" type="submit">{editandoId ? 'Actualizar' : 'Crear'}</button>
        {editandoId && (
          <button type="button" className="btn btn-cancel" onClick={() => {
            setEditandoId(null);
            setFormData({ usuarioid: '', categoriaid: '', nombre: '', descripcion: '', ubicacion: '' });
          }}>
            Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando lugares...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Categoría</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lugares.map((lugar) => (
              <tr key={lugar.id}>
                <td>{lugar.nombre}</td>
                <td>{lugar.descripcion}</td>
                <td>{lugar.ubicacion}</td>
                <td>{categorias.find((c) => c.id === lugar.categoriaid)?.tipo || lugar.categoriaid}</td>
                <td>{usuarios.find((u) => u.id === lugar.usuarioid)?.nombre || lugar.usuarioid}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={lugar.estado}
                      onChange={() => handleToggleEstado(lugar.id, lugar.estado)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button className="btn" onClick={() => handleEdit(lugar)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(lugar.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LugaresListPage;
