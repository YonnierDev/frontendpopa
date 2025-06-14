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
    setError("");

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

      try {
        // Guardar en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify({
          rol: rolId,
          nombre,
          token,
          id: usuarioId,
          correo: correoUsuario
        }));

        // Actualizar estado si existe el setter
        if (typeof setIsAuthenticated === 'function') {
          setIsAuthenticated(true);
        }

        // Navegar según el rol
        const targetPath = {
          1: "/superadmin/dashboard",
          2: "/admip/dashboard",
          3: "/propietario/dashboard"
        }[rolId] || "/login";

        // Forzar recarga para asegurar que todos los estados se actualicen
        window.location.href = targetPath;

      } catch (storageError) {
        console.error("Error al guardar en localStorage:", storageError);
        setError("Error al guardar la sesión. Intenta nuevamente.");
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
      <div className="logo-container">
        <img src={logo} alt="Photobella Logo" className="logo-img" />
      </div>

      <div className="auth-box">
        <div className="title" style={{ justifyContent: 'center', width: '100%' }}>
          <h2 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', fontSize: '2.2rem', margin: 0 }}>ACCESO</h2>
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