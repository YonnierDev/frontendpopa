import "./header.css";
import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/logos2.png";
import { useDispatch, useSelector } from "react-redux";
import { obtenerPerfil } from "../../store/perfil/perfilSlice";
import { useNavigate } from "react-router-dom";

const Header = ({ setIsAuthenticated }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const { perfil, loading, error } = useSelector((state) => state.perfil);
  const { nombre, apellido } = perfil || {};

  useEffect(() => {
    if (token) {
      dispatch(obtenerPerfil());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (!token) return null;
  if (loading) return <div className="text-light p-2">Cargando perfil...</div>;
  if (error) return <div className="text-danger p-2">Error: {error}</div>;

  return (
    <header className="header">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <img src={logo} alt="Logo" className="logo" />

        <div className="user-section">
          <FaUserCircle
            className="user-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="user-dropdown">
              <p className="mb-2">Bienvenido, {nombre} {apellido}</p>
              <button
                className="btn btn-sm btn-dark d-flex align-items-center gap-2 w-100"
                onClick={handleLogout}
              >
                <FaSignOutAlt style={{ color: "#000000" }} />
                <span style={{ color: "#000000" }}>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
