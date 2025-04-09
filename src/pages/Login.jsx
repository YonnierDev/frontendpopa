import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";
import logo from "./camm.png";

const Login = ({ setIsAuthenticated }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://popnocturna.vercel.app/api/login", {
        correo,
        contrasena,
      });

      const { token, rol, nombre, usuarioId } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify({ rol, nombre, usuarioId }));
        setIsAuthenticated(true);
        setError("");
        navigate("/dashboard"); // Esto redirige y luego App.jsx manda según el rol
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="********"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="separator">
          <span>----------------------------- o ----------------------------</span>
        </div>

        <div className="title">
          <p className="register-text">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
