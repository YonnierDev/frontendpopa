import { useState } from "react";
import { useDispatch } from "react-redux";
import { enviarCorreoRecuperacion } from "../../../store/recuperacion/recuperacionSlice";
import { showSuccess, showError } from "../../../components/alert/AlertManager";

const EnviarCorreoRecuperacion = () => {
  const dispatch = useDispatch();
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);  // Para controlar si se está enviando la solicitud
  const [success, setSuccess] = useState(false);  // Para controlar si el correo fue enviado con éxito

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) return;  // Si está en proceso, no permitir enviar nuevamente

    setLoading(true);  // Indicamos que estamos procesando la solicitud

    try {
      const res = await dispatch(enviarCorreoRecuperacion(correo)).unwrap();
      showSuccess(res.mensaje || "Correo de recuperación enviado"); // Mostrar mensaje de éxito
      setCorreo("");  // Limpiamos el campo de correo
      setSuccess(true);  // Marcamos que el correo fue enviado con éxito
    } catch (error) {
      showError(error?.mensaje || "Error al enviar correo");
    } finally {
      setLoading(false);  // Finalizamos el proceso, independientemente del resultado
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            disabled={loading || success}  // Deshabilitamos el input si ya se envió o está procesando
          />
          <button type="submit" disabled={loading || success}>
            {loading ? "Enviando..." : success ? "Correo enviado" : "Enviar correo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnviarCorreoRecuperacion;
