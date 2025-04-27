import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ComentarioCalificacionBox.css';

const ComentarioCalificacionBox = ({ lugarId }) => {
  const navigate = useNavigate();
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const usuario = localStorage.getItem('usuario');
  const isLogged = Boolean(localStorage.getItem('token') && usuario);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (!comentario || !calificacion) {
      setMensaje('Por favor completa comentario y calificación.');
      return;
    }
    // Aquí iría la lógica real de envío a la API
    setMensaje('¡Comentario y calificación enviados! (Simulado)');
    setComentario('');
    setCalificacion(0);
  };

  if (!isLogged) {
    return (
      <div className="comentario-login-aviso">
        <p>Para continuar tienes que iniciar sesión.</p>
        <button className="btn-login-redir" onClick={() => navigate('/login')}>Ir a login</button>
      </div>
    );
  }

  return (
    <form className="comentario-calificacion-box" onSubmit={handleSubmit}>
      <h3>Deja tu comentario o calificación</h3>
      <textarea
        value={comentario}
        onChange={e => setComentario(e.target.value)}
        placeholder="Escribe tu comentario..."
        rows={3}
        required
      />
      <div className="calificacion-stars">
        {[1,2,3,4,5].map(n => (
          <span
            key={n}
            className={n <= calificacion ? 'star selected' : 'star'}
            onClick={() => setCalificacion(n)}
            style={{cursor:'pointer'}}
          >★</span>
        ))}
      </div>
      <button type="submit">Enviar</button>
      {mensaje && <div className="comentario-mensaje">{mensaje}</div>}
    </form>
  );
};

export default ComentarioCalificacionBox;
