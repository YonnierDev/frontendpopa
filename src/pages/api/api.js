import axios from "axios";

export const api = axios.create({
  baseURL: "https://backend-1ky982i25-yonnierdevs-projects.vercel.app/api", // Asegúrate de que el backend usa HTTPS
  headers: {
    "Content-Type": "application/json",
  },
});
