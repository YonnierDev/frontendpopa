import "./AuthForm.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/logos.png";
import { showSuccess, showError } from "../../../components/alert/AlertManager";

const Login = ({ setIsAuthenticated }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await axios.post("https://popnocturna.vercel.app/api/login", {
        correo,
        contrasena,
      });

      console.log("Respuesta del servidor:", response.data);

      const { token, usuario } = response.data;
      const { rolid, nombre, id: usuarioId, correo: correoUsuario } = usuario;

      if (!token || rolid === undefined) {
        setError("Respuesta inválida del servidor.");
        return;
      }

      const rolId = parseInt(rolid);

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify({
        rolid: rolId,
        nombre,
        id: usuarioId,
        correo: correoUsuario,
        token
      }));

      setIsAuthenticated(true);
      setError("");
      showSuccess("¡Inicio de sesión exitoso!");

      switch (rolId) {
        case 1:
          navigate("/superadmin", { replace: true });
          break;
        case 2:
          navigate("/adminp", { replace: true });
          break;
        case 3:
          navigate("/propietario", { replace: true });
          break;
        case 8:
          navigate("/panel-de-control", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
          break;
      }

    } catch (err) {
      console.error("Error en login:", err);
      if (err.response && err.response.status === 401) {
        showError("Credenciales incorrectas.");
      } else {
        showError("Error al iniciar sesión. Intenta más tarde.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <div className="auth-box">
        <div className="title">
          <h2>LOGIN</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <button type="submit">Ingresar</button>
        </form>

        <p className="register-text mt-3">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
        <p className="register-text">
          <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
