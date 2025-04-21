
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, createRol, updateRol, deleteRol,} from '../../../store/roles/rolesSlice';

const RolesListPage = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.roles);

  const [nuevoRol, setNuevoRol] = useState({ nombre: '' });
  const [modoEdicionId, setModoEdicionId] = useState(null);
  const [edicionTemporal, setEdicionTemporal] = useState({ nombre: '' });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setNuevoRol({ ...nuevoRol, [e.target.name]: e.target.value });
  };

  const handleCrearRol = () => {
    if (!nuevoRol.nombre.trim()) return;
    dispatch(createRol(nuevoRol.nombre)).then(() => {
      dispatch(fetchRoles());
      setNuevoRol({ nombre: '' });
    });
  };

  const iniciarEdicion = (rol) => {
    setModoEdicionId(rol.id);
    setEdicionTemporal({ nombre: rol.nombre });
  };

  const guardarEdicion = (id) => {
    if (!edicionTemporal.nombre.trim()) return;
    dispatch(updateRol({ id, nombre: edicionTemporal.nombre })).then(() => {
      dispatch(fetchRoles());
      setModoEdicionId(null);
    });
  };

  const handleEliminarRol = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      dispatch(deleteRol(id));
    }
  };

  return (
    <div className="role-list-container">
      <div className="header-section">
        <h2 className="title">Roles</h2>
        <p className="subtitle">Gestiona los roles disponibles en el sistema.</p>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <>
          <div className="create-role-form mb-4">
            <h5>Crear nuevo rol</h5>
            <div className="form-grid">
              <input
                name="nombre"
                type="text"
                className="form-control"
                placeholder="Nombre del rol"
                value={nuevoRol.nombre}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="btn btn-secondary mt-2"
              onClick={handleCrearRol}
            >
              Crear
            </button>
          </div>

          <div className="list-role-form mb-4">
            <h4 className="section-title">Lista de Roles</h4>
            <table className="table table-striped styled-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th style={{ width: "200px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((rol) => (
                  <tr key={rol.id}>
                    <td>
                      {modoEdicionId === rol.id ? (
                        <input
                          className="form-control"
                          value={edicionTemporal.nombre}
                          onChange={(e) =>
                            setEdicionTemporal({
                              ...edicionTemporal,
                              nombre: e.target.value,
                            })
                          }
                        />
                      ) : (
                        rol.nombre
                      )}
                    </td>
                    <td>
                      {modoEdicionId === rol.id ? (
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => guardarEdicion(rol.id)}
                        >
                          Guardar
                        </button>
                      ) : (
                        <button
                          className="btn btn-secondary btn-sm me-2"
                          onClick={() => iniciarEdicion(rol)}
                        >
                          Editar
                        </button>
                      )}
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEliminarRol(rol.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default RolesListPage;
