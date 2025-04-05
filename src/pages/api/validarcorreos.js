import { api } from "./api";

// Validar correo con código
export const validarCorreo = async ({ correo, codigo }) => {
  try {
    const response = await api.post("/validar/correo", { correo, codigo });
    return response.data;
  } catch (error) {
    console.error("Error al validar el correo:", error.response?.data || error.message);
    throw error;
  }
};
