import React, { useEffect, useState } from 'react';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaTags, FaComment, FaStar, FaClipboardList, FaBell } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import '../styles/SuperAdminStats.css';

const COLORS = ['#ffcc00', '#ff9800', '#ff0000'];

const SuperAdminStats = () => {
  const [stats, setStats] = useState({
    usuarios: 0,
    eventos: 0,
    reservas: 0,
    reservasAprobadas: 0,
    reservasPendientes: 0,
    reservasRechazadas: 0,
    lugares: 0,
    categorias: 0,
    comentarios: 0,
    calificaciones: 0,
    solicitudes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        // Puedes ajustar los endpoints según tu backend
        const [usuarios, eventos, reservas, lugares, categorias, comentarios, calificaciones, solicitudes] = await Promise.all([
          axios.get('https://popnocturna.vercel.app/api/usuarios', { headers }),
          axios.get('https://popnocturna.vercel.app/api/eventos', { headers }),
          axios.get('https://popnocturna.vercel.app/api/reservas', { headers }),
          axios.get('https://popnocturna.vercel.app/api/lugares', { headers }),
          axios.get('https://popnocturna.vercel.app/api/categorias', { headers }),
          axios.get('https://popnocturna.vercel.app/api/comentarios', { headers }),
          axios.get('https://popnocturna.vercel.app/api/calificaciones', { headers }),
          axios.get('https://popnocturna.vercel.app/api/solicitudes', { headers })
        ]);
        // Estadísticas de reservas por estado
        const reservasData = Array.isArray(reservas.data) ? reservas.data : reservas.data.datos?.rows || [];
        const reservasAprobadas = reservasData.filter(r => r.aprobacion === 'aceptado').length;
        const reservasPendientes = reservasData.filter(r => r.aprobacion === 'pendiente' || r.aprobacion === 'Pendiente').length;
        const reservasRechazadas = reservasData.filter(r => r.aprobacion === 'rechazado').length;
        setStats({
          usuarios: usuarios.data.length,
          eventos: eventos.data.length,
          reservas: reservasData.length,
          reservasAprobadas,
          reservasPendientes,
          reservasRechazadas,
          lugares: lugares.data.length,
          categorias: categorias.data.length,
          comentarios: comentarios.data.length,
          calificaciones: calificaciones.data.length,
          solicitudes: solicitudes.data.length
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Aprobadas', value: stats.reservasAprobadas },
    { name: 'Pendientes', value: stats.reservasPendientes },
    { name: 'Rechazadas', value: stats.reservasRechazadas }
  ];

  if (loading) return <div className="superadmin-stats-loading">Cargando estadísticas...</div>;

  return (
    <div className="superadmin-stats-container">
      <div className="superadmin-stats-cards">
        <div className="superadmin-stats-card"><FaUsers /><span>{stats.usuarios}</span><label>Usuarios</label></div>
        <div className="superadmin-stats-card"><FaCalendarAlt /><span>{stats.eventos}</span><label>Eventos</label></div>
        <div className="superadmin-stats-card"><FaClipboardList /><span>{stats.reservas}</span><label>Reservas</label></div>
        <div className="superadmin-stats-card"><FaMapMarkerAlt /><span>{stats.lugares}</span><label>Lugares</label></div>
        <div className="superadmin-stats-card"><FaTags /><span>{stats.categorias}</span><label>Categorías</label></div>
        <div className="superadmin-stats-card"><FaComment /><span>{stats.comentarios}</span><label>Comentarios</label></div>
        <div className="superadmin-stats-card"><FaStar /><span>{stats.calificaciones}</span><label>Calificaciones</label></div>
        <div className="superadmin-stats-card"><FaBell /><span>{stats.solicitudes}</span><label>Solicitudes</label></div>
      </div>
      <div className="superadmin-stats-graph">
        <h4>Reservas por Estado</h4>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SuperAdminStats; 