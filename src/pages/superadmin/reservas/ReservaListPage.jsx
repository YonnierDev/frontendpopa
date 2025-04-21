import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Badge, Form } from "react-bootstrap";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import { showSuccess, showError, showInfo } from "../../../components/alert/AlertManager";
import { fetchReservas, updateReservaStatus } from "../../../store/reservas/reservasSlice";
import "../styles/SuperAdmin.css";
 
const ReservaListPage = () => {
  const dispatch = useDispatch();
  const { reservas, loading } = useSelector((state) => state.reservas);
  const [filtro, setFiltro] = useState({
    buscar: "",
    estado: "todos"
  });

  useEffect(() => {
    dispatch(fetchReservas())
      .unwrap()
      .catch((err) => {
        showError(`Error al cargar las reservas: ${err}`);
      });
  }, [dispatch]);

  const handleFiltroChange = (e) => {
    setFiltro({
      ...filtro,
      [e.target.name]: e.target.value
    });
  };

  const handleCambiarEstado = (reservaId, nuevoEstado) => {
    dispatch(updateReservaStatus({ reservaId, status: nuevoEstado }))
      .unwrap()
      .then(() => {
        showSuccess(`Reserva ${nuevoEstado} exitosamente`);
      })
      .catch((err) => {
        showError(`Error al actualizar la reserva: ${err}`);
      });
  };

  const handleVerDetalles = (reservaId) => {
    // Aquí implementaremos la vista de detalles
    // Por ahora solo mostraremos un mensaje
    showInfo(`Ver detalles de la reserva ${reservaId}`);
  };

  return (
    <div className="superadmin-container">
      <h2 className="superadmin-title">Gestión de Reservas</h2>
      
      <div className="filters-container mb-4">
        <Form className="d-flex gap-3">
          <Form.Group className="flex-grow-1">
            <Form.Control
              type="text"
              placeholder="Buscar por usuario o evento..."
              name="buscar"
              value={filtro.buscar}
              onChange={handleFiltroChange}
            />
          </Form.Group>
          <Form.Group style={{ width: "200px" }}>
            <Form.Select
              name="estado"
              value={filtro.estado}
              onChange={handleFiltroChange}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Cargando reservas...</p>
        </div>
      ) : reservas.length === 0 ? (
        <div className="text-center">
          <p>No hay reservas registradas.</p>
        </div>
      ) : (
        <Table responsive hover className="superadmin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Lugar</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.usuario?.nombre}</td>
                <td>{reserva.evento?.nombre}</td>
                <td>{reserva.evento?.lugar?.nombre}</td>
                <td>{new Date(reserva.fecha).toLocaleString()}</td>
                <td>
                  <Badge bg={
                    reserva.estado === 'confirmada' ? 'success' :
                    reserva.estado === 'pendiente' ? 'warning' :
                    'danger'
                  }>
                    {reserva.estado.toUpperCase()}
                  </Badge>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleVerDetalles(reserva.id)}
                    >
                      <FaEye />
                    </Button>
                    {reserva.estado === 'pendiente' && (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleCambiarEstado(reserva.id, 'confirmada')}
                        >
                          <FaCheck />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCambiarEstado(reserva.id, 'cancelada')}
                        >
                          <FaTimes />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ReservaListPage;

