import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge } from 'react-bootstrap';
import { obtenerSolicitudes, actualizarEstadoSolicitud } from '../../features/trabajoSolicitudes/trabajoSolicitudesSlice';

const GestionSolicitudes = () => {
  const dispatch = useDispatch();
  const { solicitudes, loading } = useSelector(state => state.trabajoSolicitudes);

  useEffect(() => {
    dispatch(obtenerSolicitudes());
  }, [dispatch]);

  const handleActualizarEstado = async (id, estado) => {
    try {
      await dispatch(actualizarEstadoSolicitud({ id, estado })).unwrap();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      pendiente: 'warning',
      aprobado: 'success',
      rechazado: 'danger'
    };
    return <Badge bg={variants[estado]}>{estado.toUpperCase()}</Badge>;
  };

  if (loading) {
    return <div>Cargando solicitudes...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Gestión de Solicitudes de Trabajo</h2>
      
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Mensaje</th>
            <th>Experiencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map(solicitud => (
            <tr key={solicitud.id}>
              <td>{solicitud.usuario?.nombre}</td>
              <td>{solicitud.mensaje}</td>
              <td>{solicitud.experiencia}</td>
              <td>{getEstadoBadge(solicitud.estado)}</td>
              <td>
                {solicitud.estado === 'pendiente' && (
                  <div className="d-flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleActualizarEstado(solicitud.id, 'aprobado')}
                    >
                      Aprobar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleActualizarEstado(solicitud.id, 'rechazado')}
                    >
                      Rechazar
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GestionSolicitudes;
