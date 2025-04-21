import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { actualizarContrasena } from "../../../store/recuperacion/recuperacionSlice";
import { useParams, useNavigate } from "react-router-dom";
import "./Recuperacion.css";

const ActualizarContrasenaPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const [nuevaContrasena, setNuevaContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(actualizarContrasena({ token, nuevaContrasena }));
    if (!result.error) navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Actualizar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            required
          />
          <button type="submit">Actualizar</button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarContrasenaPage;
