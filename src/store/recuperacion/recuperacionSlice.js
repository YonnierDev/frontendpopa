import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/api";

// Enviar correo de recuperación
export const enviarCorreoRecuperacion = createAsyncThunk(
  "recuperacion/enviarCorreoRecuperacion",
  async (correo, thunkAPI) => {
    try {
      const res = await api.post("/recuperar-contrasena", { correo });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { mensaje: "Error al enviar correo" });
    }
  }
);

// Verificar token de recuperación
export const verificarTokenRecuperacion = createAsyncThunk(
  "recuperacion/verificarTokenRecuperacion",
  async (token, thunkAPI) => {
    try {
      const res = await api.get(`/recuperar-contrasena/${token}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { mensaje: "Token inválido" });
    }
  }
);

// Actualizar contraseña
export const actualizarContrasena = createAsyncThunk(
  "recuperacion/actualizarContrasena",
  async ({ token, nuevaContrasena, confirmarContrasena }, thunkAPI) => {
    // Verifica si las contraseñas están vacías
    if (!nuevaContrasena || !confirmarContrasena) {
      return thunkAPI.rejectWithValue({ mensaje: "Ambas contraseñas son obligatorias" });
    }

    // Verifica que las contraseñas coincidan
    if (nuevaContrasena !== confirmarContrasena) {
      return thunkAPI.rejectWithValue({ mensaje: "Las contraseñas no coinciden" });
    }

    try {
      const res = await api.post("/actualizar-contrasena", { token, nuevaContrasena, confirmarContrasena });
      return res.data;  // Responde con los datos obtenidos de la API
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { mensaje: "Error al actualizar contraseña" });
    }
  }
);

const recuperacionSlice = createSlice({
  name: "recuperacion",
  initialState: {
    loading: false,
    mensaje: null,
    error: null,
    tokenValido: false,
  },
  reducers: {
    resetRecuperacion: (state) => {
      state.loading = false;
      state.mensaje = null;
      state.error = null;
      state.tokenValido = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(enviarCorreoRecuperacion.pending, (state) => {
        state.loading = true;
      })
      .addCase(enviarCorreoRecuperacion.fulfilled, (state, action) => {
        state.loading = false;
        state.mensaje = action.payload.mensaje;
        state.error = null;
      })
      .addCase(enviarCorreoRecuperacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje || "Error al enviar correo";
      })
      .addCase(verificarTokenRecuperacion.fulfilled, (state) => {
        state.tokenValido = true;
        state.error = null;
      })
      .addCase(verificarTokenRecuperacion.rejected, (state, action) => {
        state.tokenValido = false;
        state.error = action.payload?.mensaje || "Token inválido";
      })
      .addCase(actualizarContrasena.fulfilled, (state, action) => {
        state.mensaje = action.payload.mensaje;
        state.error = null;
      })
      .addCase(actualizarContrasena.rejected, (state, action) => {
        state.error = action.payload?.mensaje || "Error al actualizar contraseña";
      });
  }
});

export const { resetRecuperacion } = recuperacionSlice.actions;
export default recuperacionSlice.reducer;
