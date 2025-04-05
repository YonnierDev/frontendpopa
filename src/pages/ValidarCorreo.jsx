import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarCorreo } from "./api/validarcorreos"; // ✅ Corrección aquí
import "./ValidarCorreo.css";
import logo from "./logos.png";

const ValidarCorreo = () => {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await validarCorreo({ correo, codigo });
      alert(data.mensaje);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.mensaje || "Error al validar el correo");
    }
  };

  return (
    <div className="validar-container">
      <div className="validar-box">
        <h2>Verifica tu correo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit">Validar</button>
        </form>
      </div>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-img large" />
      </div>
    </div>
  );
};

export default ValidarCorreo;
