import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (mensaje) =>
  toast.success(mensaje, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  });

export const showError = (mensaje) =>
  toast.error(mensaje, {
    position: "top-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
  });

export const showInfo = (mensaje) =>
  toast.info(mensaje, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
  });

export const AlertContainer = ToastContainer;
