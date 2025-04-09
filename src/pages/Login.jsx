import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";
import logo from "./camm.png";

const Login = ({ setIsAuthenticated }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Limpieza de campos si el usuario vuelve a esta vista
    setCorreo("");
    setContrasena("");
    setError("");
  }, []);

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

      const { token, rol, nombre, usuarioId } = response.data;

      if (!token || rol === undefined) {
        setError("Respuesta inválida del servidor.");
        return;
      }

      // Aseguramos que rol sea un número
      const rolId = parseInt(rol);

      // Guardar token y usuario
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify({ rol: rolId, nombre, usuarioId }));

      // Debug: verificar el rol
      console.log("Rol recibido:", rolId);

      // Actualiza estado global
      setIsAuthenticated(true);
      setError("");

      // Redirecciona según el rol
      switch (rolId) {
        case 1:
          navigate("/admip/dashboard");
          break;
        case 2:
          navigate("/propietario/dashboard");
          break;
        default:
          navigate("/login");
          break;
      }

    } catch (err) {
      console.error("Error en login:", err);
      if (err.response && err.response.status === 401) {
        setError("Credenciales incorrectas.");
      } else {
        setError("Error al iniciar sesión. Intenta más tarde.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="logo">
        <img src={logo} alt="Photobella Logo" className="logo-img" />
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

          <button type="submit">Iniciar sesión</button>
        </form>

        <div className="separator">
          <span>----------------------------- o ----------------------------</span>
        </div>

        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
