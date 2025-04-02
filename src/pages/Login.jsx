import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "./api/api";
import "./AuthForm.css";
import logo from "./logos.png";

const Login = ({ setIsAuthenticated }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Intentando login con:', { correo, contrasena });

      const response = await api.post("/login", {
        correo: correo,
        contrasena: contrasena
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setError("");
        
        setCorreo("");
        setContrasena("");
        
        navigate("/categorias");
      } else {
        setError(response.data?.mensaje || "Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error completo:", error);
      if (error.response?.status === 401) {
        setError("Credenciales inválidas");
      } else if (error.response?.status === 400) {
        setError("Correo y contraseña son obligatorios");
      } else {
        setError(error.response?.data?.mensaje || "Error en el servicio");
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
