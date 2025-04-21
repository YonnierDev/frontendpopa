<<<<<<< HEAD
=======

>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
import "./AuthForm.css";
import { useState } from "react";
import { api } from "../../../api/api"; 
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/logos.png";
import { useNavigate, Link } from "react-router-dom";
<<<<<<< HEAD
import { showSuccess, showError } from "../../../components/alert/AlertManager"; 
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425

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
<<<<<<< HEAD
        showSuccess("¡Inicio de sesión exitoso!");
        navigate("/panel-de-control");
=======
        alert("Login exitoso!");
        navigate("/usuarios");
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
      } else {
        throw new Error("Token no recibido");
      }
    } catch (error) {
<<<<<<< HEAD
      showError(error.response?.data?.message || "Error al iniciar sesión");
=======
      alert(error.response?.data?.message || "Error al iniciar sesión");
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
<<<<<<< HEAD
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>

        <p className="register-text mt-3">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
        <p className="register-text">
          <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
=======
          <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          <button type="submit">Ingresar</button>
        </form>
        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
        </p>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
