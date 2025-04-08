import api from "./axiosConfig";

export const getRoles = async () => {
  try {
    const response = await api.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    return [];
  }
};

export const createRol = async (rol) => {
  try {
    const response = await api.post("/roles", rol);
    return response.data;
  } catch (error) {
    console.error("Error al crear rol:", error);
  }
};
