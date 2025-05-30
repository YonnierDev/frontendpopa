import { useState } from "react";
import { api } from "../components/api/api";
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css"; 
import logo from "./camm.png";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [fecha_nacimiento, setFecha_nacimiento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [genero, setGenero] = useState("");

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
        fecha_nacimiento,
        contrasena,
        genero, // Ahora envía "Masculino", "Femenino" o "Otro"
        rolid: 4, // rol fijo predeterminado
      });

      alert("¡Registrado exitosamente! Por favor, revisa tu correo para verificar tu cuenta.");
      console.log("Respuesta:", response.data);

      // Limpiar campos después del registro
      setNombre("");
      setApellido("");
      setCorreo("");
      setFecha_nacimiento("");
      setContrasena("");
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
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={fecha_nacimiento}
            onChange={(e) => setFecha_nacimiento(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          >
            <option value="">Selecciona tu género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>

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
