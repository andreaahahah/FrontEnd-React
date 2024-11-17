import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastManager = () => {
  return <ToastContainer />;
};

// Funzioni helper per richiamare i toast
export const showToast = {
  success: (message) =>
    toast.success(message, { position: "top-right", autoClose: 3000 }),
  error: (message) =>
    toast.error(message, { position: "top-right", autoClose: 3000 }),
  info: (message) =>
    toast.info(message, { position: "top-right", autoClose: 3000 }),
  warning: (message) =>
    toast.warn(message, { position: "top-right", autoClose: 3000 }),
};

export default ToastManager;
