import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { clearAuth } from '../../store/auth/authSlice';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" className="admin-header">
      <Container fluid>
        <Navbar.Brand href="/admin">Panel de Administración</Navbar.Brand>
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              <FaUser className="me-2" />
              {user?.username || 'Admin'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/admin/perfil">
                <FaCog className="me-2" />
                Configuración
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Cerrar Sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;
