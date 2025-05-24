import React, { useEffect, useState } from 'react';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaTags, FaComment, FaStar, FaClipboardList } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import '../styles/SuperAdminStats.css';

const COLORS = ['#ffcc00', '#ff9800', '#ff0000'];

const getCount = (data) => {
  if (Array.isArray(data)) return data.length;
  if (data && Array.isArray(data.datos?.rows)) return data.datos.rows.length;
  if (data && Array.isArray(data.rows)) return data.rows.length;
  return 0;
};

const getArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.datos?.rows)) return data.datos.rows;
  if (data && Array.isArray(data.rows)) return data.rows;
  return [];
};

const SuperAdminStats = ({ onSectionChange }) => {
  const [stats, setStats] = useState({
    usuarios: 0,
    eventos: null,
    reservas: null,
    reservasAprobadas: 0,
    reservasPendientes: 0,
    reservasRechazadas: 0,
    lugares: 0,
    categorias: 0,
    comentarios: null,
    calificaciones: 0
  });
  const [loading, setLoading] = useState(true);
  const [permiso, setPermiso] = useState({ eventos: true, reservas: true, comentarios: true, calificaciones: true });
  const [auth, setAuth] = useState(true);
  const [usuarioLog, setUsuarioLog] = useState(null);
  const [tokenLog, setTokenLog] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        setUsuarioLog(usuario);
        setTokenLog(token);
        console.log('Token usado:', token);
        console.log('Usuario logueado:', usuario);
        if (!token || !usuario) {
          setAuth(false);
          setStats(s => ({ ...s, eventos: 'No autenticado', reservas: 'No autenticado', comentarios: 'No autenticado', calificaciones: 'No autenticado' }));
          setLoading(false);
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        // Usuarios, Lugares, Categorías (no requieren rol especial)
        let usuarios = [], lugares = [], categorias = [];
        try {
          const res = await axios.get('https://popnocturna.vercel.app/api/usuarios', { headers });
          usuarios = getArray(res.data);
        } catch (e) { usuarios = []; }
        try {
          const res = await axios.get('https://popnocturna.vercel.app/api/lugares', { headers });
          lugares = getArray(res.data);
        } catch (e) { lugares = []; }
        try {
          const res = await axios.get('https://popnocturna.vercel.app/api/categorias', { headers });
          categorias = getArray(res.data);
        } catch (e) { categorias = []; }
        // Eventos, Reservas, Comentarios, Calificaciones (requieren rol 1 o 2)
        let eventos = null, reservas = null, comentarios = null, calificaciones = null;
        let permisoEventos = true, permisoReservas = true, permisoComentarios = true, permisoCalificaciones = true;
        if (usuario.rol === 1 || usuario.rol === 2) {
          try {
            const res = await axios.get('https://popnocturna.vercel.app/api/eventos', { headers });
            eventos = getArray(res.data);
          } catch (e) { eventos = []; }
          try {
            const res = await axios.get('https://popnocturna.vercel.app/api/reservas', { headers });
            reservas = getArray(res.data);
          } catch (e) { reservas = []; }
          try {
            const res = await axios.get('https://popnocturna.vercel.app/api/comentarios', { headers });
            comentarios = getArray(res.data);
          } catch (e) { comentarios = []; }
          try {
            const res = await axios.get('https://popnocturna.vercel.app/api/calificaciones', { headers });
            calificaciones = getArray(res.data);
          } catch (e) { calificaciones = []; }
        } else {
          permisoEventos = false;
          permisoReservas = false;
          permisoComentarios = false;
          permisoCalificaciones = false;
        }
        // Estadísticas de reservas por estado
        const reservasAprobadas = Array.isArray(reservas) ? reservas.filter(r => r.aprobacion === 'aceptado').length : 0;
        const reservasPendientes = Array.isArray(reservas) ? reservas.filter(r => r.aprobacion === 'pendiente' || r.aprobacion === 'Pendiente').length : 0;
        const reservasRechazadas = Array.isArray(reservas) ? reservas.filter(r => r.aprobacion === 'rechazado').length : 0;
        setStats({
          usuarios: usuarios.length,
          eventos: permisoEventos ? (Array.isArray(eventos) ? eventos.length : 0) : 'Sin permisos',
          reservas: permisoReservas ? (Array.isArray(reservas) ? reservas.length : 0) : 'Sin permisos',
          reservasAprobadas,
          reservasPendientes,
          reservasRechazadas,
          lugares: lugares.length,
          categorias: categorias.length,
          comentarios: permisoComentarios ? (Array.isArray(comentarios) ? comentarios.length : 0) : 'Sin permisos',
          calificaciones: permisoCalificaciones ? (Array.isArray(calificaciones) ? calificaciones.length : 0) : 'Sin permisos'
        });
        setPermiso({ eventos: permisoEventos, reservas: permisoReservas, comentarios: permisoComentarios, calificaciones: permisoCalificaciones });
        setAuth(true);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Aprobadas', value: typeof stats.reservasAprobadas === 'number' ? stats.reservasAprobadas : 0 },
    { name: 'Pendientes', value: typeof stats.reservasPendientes === 'number' ? stats.reservasPendientes : 0 },
    { name: 'Rechazadas', value: typeof stats.reservasRechazadas === 'number' ? stats.reservasRechazadas : 0 }
  ];

  if (loading) return <div className="superadmin-stats-loading">Cargando estadísticas...</div>;

  return (
    <div className="superadmin-stats-container">
      <div className="superadmin-stats-cards">
        <div className="superadmin-stats-card" onClick={() => onSectionChange('usuarios')} style={{ cursor: 'pointer' }}>
          <FaUsers /><span>{stats.usuarios}</span><label>Usuarios</label>
        </div>
        <div className="superadmin-stats-card" onClick={() => permiso.eventos && onSectionChange('eventos')} style={{ cursor: permiso.eventos ? 'pointer' : 'not-allowed' }}>
          <FaCalendarAlt /><span>{stats.eventos === null ? '-' : stats.eventos}</span>
          <label>Eventos{!permiso.eventos && <div className="stats-warning">Sin permisos</div>}</label>
        </div>
        <div className="superadmin-stats-card" onClick={() => permiso.reservas && onSectionChange('reservas')} style={{ cursor: permiso.reservas ? 'pointer' : 'not-allowed' }}>
          <FaClipboardList /><span>{stats.reservas === null ? '-' : stats.reservas}</span>
          <label>Reservas{!permiso.reservas && <div className="stats-warning">Sin permisos</div>}</label>
        </div>
        <div className="superadmin-stats-card" onClick={() => onSectionChange('lugares')} style={{ cursor: 'pointer' }}>
          <FaMapMarkerAlt /><span>{stats.lugares}</span><label>Lugares</label>
        </div>
        <div className="superadmin-stats-card" onClick={() => onSectionChange('categorias')} style={{ cursor: 'pointer' }}>
          <FaTags /><span>{stats.categorias}</span><label>Categorías</label>
        </div>
        <div className="superadmin-stats-card" onClick={() => permiso.comentarios && onSectionChange('comentarios')} style={{ cursor: permiso.comentarios ? 'pointer' : 'not-allowed' }}>
          <FaComment /><span>{stats.comentarios === null ? '-' : stats.comentarios}</span>
          <label>Comentarios{!permiso.comentarios && <div className="stats-warning">Sin permisos</div>}</label>
        </div>
        <div className="superadmin-stats-card" onClick={() => permiso.calificaciones && onSectionChange('calificaciones')} style={{ cursor: permiso.calificaciones ? 'pointer' : 'not-allowed' }}>
          <FaStar /><span>{stats.calificaciones === null ? '-' : stats.calificaciones}</span>
          <label>Calificaciones{!permiso.calificaciones && <div className="stats-warning">Sin permisos</div>}</label>
        </div>
      </div>
      
      {!auth && <div className="stats-warning-global">Debes iniciar sesión como super admin para ver todas las estadísticas.</div>}
      <div style={{marginTop: '1rem', color: '#888', fontSize: '0.95rem'}}>
        
      </div>
    </div>
  );
};

export default SuperAdminStats; 