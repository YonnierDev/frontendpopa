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

      if (!response.data || !response.data.token || !response.data.usuario) {
        setError("Error en la respuesta del servidor. Por favor, intenta nuevamente.");
        return;
      }

      // Guardar usuario y token en localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      if (setIsAuthenticated) setIsAuthenticated(true);

      // Redirección según el rolid
      let destino = "/"; // Usuario normal por defecto
      switch (response.data.usuario.rolid) {
        case 1:
          destino = "/superadmin"; // Superadmin
          break;
        case 2:
          destino = "/admip/dashboard"; // Admin
          break;
        case 3:
          destino = "/propietario/dashboard"; // Propietario
          break;
        default:
          destino = "/"; // Usuario normal
      }

      navigate(destino);

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Correo o contraseña incorrectos.");
      } else {
        setError("Error de conexión. Por favor, intenta nuevamente.");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={logo} alt="Photobella Logo" className="logo-img" />
      </div>

      <div className="auth-box">
        <div className="title" style={{ justifyContent: 'center', width: '100%' }}>
          <h2 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', fontSize: '2.2rem', margin: 0 }}>INICIO</h2>
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
