import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../components/api/api";
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

    // Validación de campos vacíos
    if (!correo || !contrasena) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    
    // Limpiar cualquier token previo
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    try {
      const response = await api.post("/api/login", {
        correo: correo.trim().toLowerCase(),
        contrasena: contrasena.trim()
      });

      console.log("Respuesta del servidor:", response.data);

      const { token, usuario } = response.data;
      
      if (!token || !usuario) {
        throw new Error("Respuesta inválida del servidor");
      }

      const { rolid, nombre, id: usuarioId, correo: correoUsuario } = usuario;

      if (rolid === undefined) {
        throw new Error("Rol de usuario no definido");
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
      
      // Manejo de errores específicos del backend
      if (err.response) {
        // Error 401 con mensaje específico del backend
        if (err.response.status === 401) {
          setError(err.response.data.mensaje || "Credenciales incorrectas");
        } 
        // Otros códigos de error HTTP
        else if (err.response.status >= 500) {
          setError("Error del servidor. Por favor, inténtalo más tarde.");
        } else if (err.response.status === 429) {
          setError("Demasiados intentos. Por favor, espera un momento.");
        } else {
          setError("Error al procesar la solicitud. Intenta nuevamente.");
        }
      } 
      // Errores de red o de conexión
      else if (err.request) {
        setError("No se pudo conectar al servidor. Verifica tu conexión a internet.");
      } 
      // Otros errores
      else {
        setError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
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
          <h2 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', fontSize: '2.2rem', margin: 0 }}>Login</h2>
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