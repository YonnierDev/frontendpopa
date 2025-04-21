import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaCheck, FaTimes, FaUserLock } from 'react-icons/fa';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Aquí cargaríamos los usuarios desde el backend
    // fetchUsuarios();
  }, []);

  const handleToggleStatus = (userId) => {
    // Aquí manejaríamos la activación/desactivación del usuario
  };

  const handleResetPassword = (userId) => {
    // Aquí manejaríamos el reset de contraseña
  };

  return (
    <div className="admin-usuarios">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
      </div>

      <Table responsive className="admin-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Última Conexión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>
                <Badge bg={usuario.rol === 1 ? 'danger' : 'primary'}>
                  {usuario.rol === 1 ? 'SuperAdmin' : 'Usuario'}
                </Badge>
              </td>
              <td>
                <Badge bg={usuario.activo ? 'success' : 'warning'}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td>{usuario.ultima_conexion}</td>
              <td>
                <Button
                  variant={usuario.activo ? 'outline-warning' : 'outline-success'}
                  size="sm"
                  className="me-2"
                  onClick={() => handleToggleStatus(usuario.id)}
                >
                  {usuario.activo ? <FaTimes /> : <FaCheck />}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleResetPassword(usuario.id)}
                >
                  <FaUserLock />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsuarios;
