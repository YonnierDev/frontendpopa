import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css";
import logo from "./logos.png";

const Login = ({ setIsAuthenticated }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  // Datos temporales de usuario
  const usuarioTemporal = {
    correo: "marloncollazos2@gmail.com",
    contrasena: "marlon123"
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Verificación temporal con datos locales
    if (correo === usuarioTemporal.correo && contrasena === usuarioTemporal.contrasena) {
      // Simulamos un token
      const tokenTemporal = "token_temporal_123456";
      localStorage.setItem("token", tokenTemporal);
      setIsAuthenticated(true);
      alert("Login exitoso!");
      
      setCorreo("");
      setContrasena("");
      
      navigate("/categorias");
    } else {
      alert("Credenciales incorrectas");
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
