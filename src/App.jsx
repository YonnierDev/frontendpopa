import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import AppRoutes from "./AppRoutes";

// Lee el usuario y token desde localStorage para el estado inicial
const getInitialAuth = () => {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuario");
  let rol = null;
  if (token && usuarioRaw) {
    try {
      const userObj = JSON.parse(usuarioRaw);
      rol = userObj?.rolid;
    } catch {}
  }
  return {
    isAuthenticated: Boolean(token && usuarioRaw),
    rol,
    token,
    usuario: usuarioRaw
  };
};

function App() {
  const initial = getInitialAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(initial.isAuthenticated);
  const [rol, setRol] = useState(initial.rol);
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [token, setToken] = useState(initial.token);
  const [usuario, setUsuario] = useState(initial.usuario);
  const userIsAuthenticated = Boolean(token && usuario);

  // Redirige si hay un redirect pendiente tras login
  useEffect(() => {
    const redirectTo = localStorage.getItem("redirectTo");
    if (redirectTo) {
      localStorage.removeItem("redirectTo");
      window.location.replace(redirectTo);
    }
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("usuario");
      setToken(t);
      setUsuario(u);
      if (!t || !u) {
        setGuestModalOpen(false);
      }
      setIsAuthenticated(Boolean(t && u));
      if (t && u) {
        try {
          const userObj = JSON.parse(u);
          setRol(userObj?.rolid);
        } catch {
          setRol(null);
        }
      } else {
        setRol(null);
      }
    };
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    setIsAuthenticated(Boolean(token && usuario));
    if (token && usuario) {
      try {
        const userObj = JSON.parse(usuario);
        setRol(userObj?.rolid);
      } catch {
        setRol(null);
      }
    } else {
      setRol(null);
      setGuestModalOpen(false);
    }
  }, [token, usuario]);

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        rol={rol}
        guestModalOpen={guestModalOpen}
        setGuestModalOpen={setGuestModalOpen}
        userIsAuthenticated={userIsAuthenticated}
      />
    </Router>
  );
}

export default App;
