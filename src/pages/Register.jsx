import { useState } from "react";
import { api } from "../components/api/api";
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css"; 
import logo from "./camm.png";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Ya no necesitas validar género con siglas, solo que no esté vacío
    if (!genero) {
      alert("Por favor selecciona un género válido");
      return;
    }

    try {
      const response = await api.post("/registrar", {
        nombre,
        apellido,
        correo,
        contrasena,
        fecha_nacimiento: fechaNacimiento,
        genero,
        rolid: 4 // Propietario
      });

      if (response.data.codigo === "REGISTRO_EXITOSO") {
        alert("Registro exitoso");
        navigate("/login");
        console.log("Respuesta:", response.data);

        // Limpiar campos después del registro
        setNombre("");
        setApellido("");
        setCorreo("");
        setContrasena("");
        setFechaNacimiento("");
        setGenero("");
      }
      setFechaNacimiento("");
      setGenero("");

      navigate("/usuarios"); 
    } catch (error) {
      const msg = error.response?.data?.mensaje || "Error desconocido";
      alert(msg);
      console.error("Error al registrar:", error.response?.data || error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src={logo} alt="Photobella Logo" />
      </div>

      <div className="auth-box">
        <h2 className="title">Registro</h2>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
            <small className="password-requirements">
              La contraseña debe tener:
              <br />
              - Entre 8 y 20 caracteres
              <br />
              - Al menos una letra mayúscula
              <br />
              - Al menos una letra minúscula
              <br />
              - Al menos un número
              <br />
              - Al menos un símbolo
            </small>
          </div>

          <div className="input-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="input-group">
            <label htmlFor="genero">Género</label>
            <select
              id="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              required
            >
              <option value="">Selecciona tu género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <button type="submit">Registrarse</button>
        </form>

        <div className="separator">
          <span>----------------------------- o ----------------------------</span>
        </div>

        <p className="register-text">
          ¿Tienes cuenta? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
