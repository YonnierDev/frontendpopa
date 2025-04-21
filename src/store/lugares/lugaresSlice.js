import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api/api";

// Thunk para obtener todos los lugares
export const fetchLugares = createAsyncThunk('lugares/fetchLugares', async () => {
  const res = await api.get('/lugares');
  return res.data;
});

// Thunk para buscar un lugar específico por ID con relaciones
export const buscarLugar = createAsyncThunk('lugares/buscarLugar', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/lugar/${id}`);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Thunk para crear un nuevo lugar
export const createLugar = createAsyncThunk('lugares/createLugar', async (nuevoLugar) => {
  const res = await api.post('/lugar', nuevoLugar);
  return res.data;
});

// Thunk para actualizar un lugar
export const updateLugar = createAsyncThunk('lugares/updateLugar', async ({ id, datos }) => {
  const res = await api.put(`/lugar/${id}`, datos);
  return res.data;
});

// Thunk para eliminar un lugar
export const deleteLugar = createAsyncThunk('lugares/deleteLugar', async (id) => {
  await api.delete(`/lugar/${id}`);
  return id;
});

// Thunk para cambiar el estado de un lugar
export const toggleEstadoLugar = createAsyncThunk('lugares/toggleEstadoLugar', async ({ id, estado }) => {
  const res = await api.patch(`/lugar/estado/${id}`, { estado });
  return res.data.lugar;
});

const lugaresSlice = createSlice({
  name: 'lugares',
  initialState: {
    lugares: [],
    lugarSeleccionado: null, // Para almacenar el lugar buscado
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Lugares
      .addCase(fetchLugares.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLugares.fulfilled, (state, action) => {
        state.loading = false;
        state.lugares = action.payload;
      })
      .addCase(fetchLugares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Buscar Lugar
      .addCase(buscarLugar.pending, (state) => {
        state.loading = true;
        state.lugarSeleccionado = null;
      })
      .addCase(buscarLugar.fulfilled, (state, action) => {
        state.loading = false;
        state.lugarSeleccionado = action.payload;
      })
      .addCase(buscarLugar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Crear Lugar
      .addCase(createLugar.fulfilled, (state, action) => {
        state.lugares.push(action.payload);
      })

      // Actualizar Lugar
      .addCase(updateLugar.fulfilled, (state, action) => {
        const index = state.lugares.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.lugares[index] = action.payload;
      })

      // Eliminar Lugar
      .addCase(deleteLugar.fulfilled, (state, action) => {
        state.lugares = state.lugares.filter((l) => l.id !== action.payload);
      })

      // Cambiar Estado Lugar
      .addCase(toggleEstadoLugar.fulfilled, (state, action) => {
        const index = state.lugares.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.lugares[index] = action.payload;
      });
  },
});

export default lugaresSlice.reducer;
