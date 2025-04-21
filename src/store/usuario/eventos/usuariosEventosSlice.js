import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from '../../../api/api'; 

// Thunk para listar todos los eventos
export const listarEventos = createAsyncThunk(
  "usuariosEventos/listarEventos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/eventos"); // Llamada al endpoint del backend
      return response.data;
    } catch (error) {
      console.error("Error al listar eventos:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Thunk para buscar eventos con filtros
export const buscarEventos = createAsyncThunk(
  "usuariosEventos/buscarEventos",
  async (filtros, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filtros).toString(); // Convierte los filtros en parámetros de consulta
      const response = await api.get(`/eventos/buscar?${queryParams}`); // Llamada al endpoint del backend
      return response.data;
    } catch (error) {
      console.error("Error al buscar eventos:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const usuariosEventosSlice = createSlice({
  name: "usuariosEventos",
  initialState: {
    eventos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers para listar eventos
      .addCase(listarEventos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listarEventos.fulfilled, (state, action) => {
        state.loading = false;
        state.eventos = action.payload;
      })
      .addCase(listarEventos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reducers para buscar eventos
      .addCase(buscarEventos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buscarEventos.fulfilled, (state, action) => {
        state.loading = false;
        state.eventos = action.payload;
      })
      .addCase(buscarEventos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usuariosEventosSlice.reducer;