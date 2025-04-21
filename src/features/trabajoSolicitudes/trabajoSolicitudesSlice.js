import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/api';


// Thunks
export const crearSolicitud = createAsyncThunk(
  'trabajoSolicitudes/crear',
  async (datos) => {
    const response = await api.post('/trabajo-solicitudes', datos);
    return response.data;
  }
);

export const obtenerSolicitudes = createAsyncThunk(
  'trabajoSolicitudes/obtenerTodas',
  async () => {
    const response = await api.get('/trabajo-solicitudes');
    return response.data;
  }
);

export const actualizarEstadoSolicitud = createAsyncThunk(
  'trabajoSolicitudes/actualizarEstado',
  async ({ id, estado }) => {
    const response = await api.patch(`/trabajo-solicitudes/${id}/estado`, { estado });
    return response.data;
  }
);

const trabajoSolicitudesSlice = createSlice({
  name: 'trabajoSolicitudes',
  initialState: {
    solicitudes: [],
    loading: false,
    error: null,
    solicitudActual: null
  },
  reducers: {
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Crear solicitud
      .addCase(crearSolicitud.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearSolicitud.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitudes.push(action.payload);
      })
      .addCase(crearSolicitud.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Obtener solicitudes
      .addCase(obtenerSolicitudes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerSolicitudes.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitudes = action.payload;
      })
      .addCase(obtenerSolicitudes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Actualizar estado
      .addCase(actualizarEstadoSolicitud.fulfilled, (state, action) => {
        const index = state.solicitudes.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.solicitudes[index] = action.payload;
        }
      });
  }
});

export const { limpiarError } = trabajoSolicitudesSlice.actions;
export default trabajoSolicitudesSlice.reducer;
