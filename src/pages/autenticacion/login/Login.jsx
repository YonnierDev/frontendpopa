
import "./AuthForm.css";
import { useState } from "react";
import { api } from "../../../api/api"; 
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/logos.png";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", { correo, contrasena });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        alert("Login exitoso!");
        navigate("/usuarios");
      } else {
        throw new Error("Token no recibido");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <div className="auth-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          <button type="submit">Ingresar</button>
        </form>
        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;