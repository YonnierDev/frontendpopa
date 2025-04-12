import { useEffect, useState } from "react";
import { api } from "../api/api";
import "./ReservaListPage.css"; // Asegúrate de importar los estilos
 
const ReservaListPage = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscar, setBuscar] = useState("");

  useEffect(() => {
    api.get("/reservas")
      .then((res) => {
        setReservas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener reservas:", err);
        setLoading(false);
      });
  }, []);

  const handleBuscar = (e) => {
    setBuscar(e.target.value);
  }

  return (
    <div className="reserva-list-container">
      <h2>Lista de Reservas</h2>
      <input
      type="text"
      placeholder="Buscar Reserva"
      value={search}
      onChange={handleBuscar}
      />
      {loading ? (
        <p>Cargando...</p>
      ) : reservas.length === 0 ? (
        <p>No hay Reservas registradas.</p>
      ) : (
        <table className="reserva-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Evento</th>
              <th>Fecha/hora</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.usuarioid}</td>
                <td>{reserva.eventoid}</td>
                <td>{reserva.fecha_hora}</td>
                <td>{reserva.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReservaListPage;

