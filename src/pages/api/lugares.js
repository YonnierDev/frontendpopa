import { api } from "./api";

export const getLugares = async () => {
  try {
    const response = await api.get("/lugares");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los lugares:", error.response?.data || error.message);
    return [];
  }
};

export const getLugarById = async (id) => {
  try {
    const response = await api.get(`/lugar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el lugar:", error.response?.data || error.message);
    return null;
  }
};

export const updateLugar = async (id, lugar) => {
  try {
    await api.put(`/lugar/${id}`, lugar);
  } catch (error) {
    console.error("Error al actualizar el lugar:", error.response?.data || error.message);
  }
};

export const toggleLugarEstado = async (id) => {
  try {
    await api.put(`/lugar/${id}/estado`);
  } catch (error) {
    console.error("Error al cambiar el estado:", error.response?.data || error.message);
  }
};
