import { useState } from "react";
import { api } from "../components/api/api";
import { useNavigate, Link } from "react-router-dom";
import "./AuthForm.css"; // Asegúrate de importar el CSS
import logo from "./logos.png"; // Ruta de la imagen
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
    try {
      const response = await api.post("/usuario", {
        nombre,
        apellido,
        correo,
        fecha_nacimiento,
        contrasena,
        genero,
      });

      console.log("Usuario registrado:", response.data);
      alert("REGISTRADO EXITOSAMENTE!");

      setNombre("");
      setApellido("");
      setCorreo("");
      setFecha_nacimiento("");
      setContrasena("");
      setGenero("");

      navigate("/usuarios");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert(error.response.data.mensaje || "El correo ya está registrado.");
        } else {
          alert("Error en la petición, revisa la consola.");
        }
      } else {
        alert("Error en la conexión con el servidor.");
      }
      console.error("ERROR AL REGISTRAR:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="title">
          <h2>Registro</h2>
        </div>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre"
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            onChange={(e) => setApellido(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Correo"
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="date"
            placeholder="fecha de nacimiento"
            onChange={(e) => setFecha_nacimiento(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
            <option value="">Selecciona tu género</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="Otro">Otro</option>
          </select>

          <button type="submit">Registrarse</button>
        </form>
        <div className="separator">
          <span>
            ----------------------------- o ----------------------------
          </span>
        </div>

        <div className="title">
          <p className="register-text">
            ¿Tienes cuenta? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <div className="logo">
        <img src={logo} alt="Photobella Logo" className="logo-img" />
        <div className="logo-text"></div>
      </div>
    </div>
  );
};

export default Register;