import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  toggleEstadoCategoria,
  fetchLugaresPorCategoria
} from '../../../store/categorias/categoriasSlice';
import { showSuccess, showError, showInfo } from '../../../components/alert/AlertManager';
import './CategoriasListPage.css';

const CategoriasListPage = () => {
  const dispatch = useDispatch();
  const { categorias, lugaresPorCategoria } = useSelector((state) => state.categorias);
  const [tipo, setTipo] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({});

  useEffect(() => {
    dispatch(fetchCategorias());
  }, [dispatch]);

  const handleCrearCategoria = () => {
    if (tipo.trim() !== '') {
      dispatch(createCategoria(tipo))
        .unwrap()
        .then(() => {
          showSuccess('Categoría creada exitosamente');
          setTipo('');
        })
        .catch(() => showError('Error al crear categoría'));
    }
  };

  const iniciarEdicion = (categoria) => {
    setModoEdicion(true);
    setCategoriaActual(categoria);
    setTipo(categoria.tipo);
  };

  const handleActualizarCategoria = () => {
    if (tipo.trim() !== '') {
      dispatch(updateCategoria({ id: categoriaActual.id, tipo }))
        .unwrap()
        .then(() => {
          showSuccess('Categoría actualizada correctamente');
          setModoEdicion(false);
          setTipo('');
          setCategoriaActual(null);
        })
        .catch(() => showError('Error al actualizar categoría'));
    }
  };

  const handleEliminarCategoria = (id) => {
    dispatch(deleteCategoria(id))
      .unwrap()
      .then(() => showSuccess('Categoría eliminada'))
      .catch(() => showError('No se pudo eliminar la categoría'));
  };

  const handleToggleEstado = (id, estadoActual) => {
    dispatch(toggleEstadoCategoria({ id, estado: !estadoActual }))
      .unwrap()
      .then(() => showInfo('Estado de categoría actualizado'))
      .catch(() => showError('Error al cambiar el estado'));
  };

  const handleVerLugares = (id) => {
    const yaAbierto = categoriasAbiertas[id];
    if (!yaAbierto) dispatch(fetchLugaresPorCategoria(id));
    setCategoriasAbiertas((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="role-list-container">
      <h2 className="mb-4 text-light">Categorías</h2>

      <div className="create-role-form mb-4">
        <input
          type="text"
          placeholder="Tipo de categoría"
          className="form-control me-2"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <button className="btn btn-primary" onClick={modoEdicion ? handleActualizarCategoria : handleCrearCategoria}>
          {modoEdicion ? 'Actualizar' : 'Crear'}
        </button>
      </div>

      <table className="styled-table table table-dark table-hover table-bordered">
        <thead className="table-secondary">
          <tr>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <React.Fragment key={categoria.id}>
              <tr>
                <td>{categoria.tipo}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={categoria.estado}
                      onChange={() => handleToggleEstado(categoria.id, categoria.estado)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm me-2" onClick={() => iniciarEdicion(categoria)}>
                    Editar
                  </button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEliminarCategoria(categoria.id)}>
                    Eliminar
                  </button>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleVerLugares(categoria.id)}
                  >
                    {categoriasAbiertas[categoria.id] ? 'Ocultar lugares' : 'Ver lugares'}
                  </button>
                </td>
              </tr>
              {categoriasAbiertas[categoria.id] && lugaresPorCategoria[categoria.id] && (
                <tr>
                  <td colSpan="3" className="bg-dark text-light">
                    <strong>Lugares:</strong>
                    <ul className="mt-2">
                      {lugaresPorCategoria[categoria.id].map((lugar) => (
                        <li key={lugar.id}>{lugar.nombre}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriasListPage;
