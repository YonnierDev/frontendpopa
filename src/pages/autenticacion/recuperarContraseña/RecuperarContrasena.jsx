import { useState } from "react";
import { showSuccess, showError } from "../../../components/alert/AlertManager";
import { useDispatch } from "react-redux";
import { actualizarContrasena } from "../../../store/recuperacion/recuperacionSlice";
import { useNavigate, useParams } from "react-router-dom";
import "./Recuperacion.css";

const RecuperarContrasena = () => {
  const { token } = useParams();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Limpiar cualquier mensaje de error previo
    setError("");

    // Validación: Las contraseñas deben coincidir
    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Validación de formato de contraseña (al menos 1 mayúscula, 1 número, 1 carácter especial)
    const contrasenavalida = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    if (!contrasenavalida.test(nuevaContrasena)) {
      setError("La contraseña debe tener entre 8 y 20 caracteres, incluir al menos una mayúscula, un número y un carácter especial.");
      return;
    }

    // Si las validaciones pasan, llamamos al dispatch para actualizar la contraseña
    dispatch(actualizarContrasena({ token, nuevaContrasena, confirmarContrasena }))
      .then((response) => {
        if (response.payload) {
          showSuccess(response.payload.mensaje || "Contraseña actualizada correctamente");
          navigate("/login");
        }
      })
      .catch((err) => {
        // En caso de error, mostramos un mensaje de error
        const mensajeError = err?.payload?.mensaje || err.message || "Error al actualizar la contraseña";
        showError(mensajeError);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="header-container">
          <h2>Restablecer Contraseña</h2>
          {/* Icono de advertencia con información al hacer hover */}
          <span className="info-icon" title="La nueva contraseña debe tener:
            1. Entre 8 y 20 caracteres
            2. Incluir al menos una letra mayúscula
            3. Un número
            4. Un carácter especial (ejemplo: !, @, #, $)">
            !
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            required
          />
          {error && <p style={{ color: "red" }}>{error}</p>}  {/* Mostrar error si las contraseñas no coinciden o validación falla */}
          <button type="submit">Actualizar contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
