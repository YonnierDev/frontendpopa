import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <Container fluid>
        <Row>
          <Col md={2} className="admin-sidebar">
            <AdminSidebar />
          </Col>
          <Col md={10} className="admin-content">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;
