import "./AuthForm.css";
import { useState } from "react";
import { api } from "../../../api/api";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../assets/logos.png";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [fecha_nacimiento, setFechaNacimiento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [genero, setGenero] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/registrar", { nombre, apellido, correo, fecha_nacimiento, contrasena, genero });
      alert("Registro exitoso!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al registrarse");
    }
  };

  return (
    <div className="auth-container-register">
      <div className="auth-box">
        <h2>Registro</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} required />
          <input type="text" placeholder="Apellido" onChange={(e) => setApellido(e.target.value)} required />
          <input type="email" placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} required />
          <input type="date" onChange={(e) => setFechaNacimiento(e.target.value)} required />
          <input type="password" placeholder="Contraseña" onChange={(e) => setContrasena(e.target.value)} required />
          <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
            <option value="">Selecciona tu género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otros">Otro</option>
          </select>
          <button type="submit">Registrarse</button>
        </form>
        <p className="register-text">¿Tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img large" />
      </div>
    </div>
  );
};

export default Register;