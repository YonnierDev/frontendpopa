import { api } from "./api";

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.response?.data || error.message);
    return [];
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/usuario/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el usuario:", error.response?.data || error.message);
    return null;
  }
};

// Crear nuevo usuario
export const crearUsuario = async (usuarioData) => {
  try {
    const response = await api.post("/usuario", usuarioData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el usuario:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar usuario
export const actualizarUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuario/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  try {
    await api.delete(`/usuario/${id}`);
  } catch (error) {
    console.error("Error al eliminar el usuario:", error.response?.data || error.message);
    throw error;
  }
};

// Cambiar estado (activar/desactivar) usuario
export const toggleUsuarioEstado = async (id, nuevoEstado) => {
  try {
    await api.patch(`/usuario/${id}/estado`, { estado: nuevoEstado });
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error.response?.data || error.message);
  }
};

// Obtener usuarios por rol
export const getUsuariosByRol = async (rolId) => {
  try {
    const response = await api.get(`/usuarios/rol/${rolId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuarios por rol:", error.response?.data || error.message);
    return [];
  }
};
