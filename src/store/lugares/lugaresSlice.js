import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api/api";

<<<<<<< HEAD
// Thunk para obtener todos los lugares
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
export const fetchLugares = createAsyncThunk('lugares/fetchLugares', async () => {
  const res = await api.get('/lugares');
  return res.data;
});

<<<<<<< HEAD
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
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
export const createLugar = createAsyncThunk('lugares/createLugar', async (nuevoLugar) => {
  const res = await api.post('/lugar', nuevoLugar);
  return res.data;
});

<<<<<<< HEAD
// Thunk para actualizar un lugar
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
export const updateLugar = createAsyncThunk('lugares/updateLugar', async ({ id, datos }) => {
  const res = await api.put(`/lugar/${id}`, datos);
  return res.data;
});

<<<<<<< HEAD
// Thunk para eliminar un lugar
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
export const deleteLugar = createAsyncThunk('lugares/deleteLugar', async (id) => {
  await api.delete(`/lugar/${id}`);
  return id;
});

<<<<<<< HEAD
// Thunk para cambiar el estado de un lugar
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
export const toggleEstadoLugar = createAsyncThunk('lugares/toggleEstadoLugar', async ({ id, estado }) => {
  const res = await api.patch(`/lugar/estado/${id}`, { estado });
  return res.data.lugar;
});

const lugaresSlice = createSlice({
  name: 'lugares',
  initialState: {
    lugares: [],
<<<<<<< HEAD
    lugarSeleccionado: null, // Para almacenar el lugar buscado
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
<<<<<<< HEAD
      // Fetch Lugares
=======
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
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
<<<<<<< HEAD

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
=======
      .addCase(createLugar.fulfilled, (state, action) => {
        state.lugares.push(action.payload);
      })
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
      .addCase(updateLugar.fulfilled, (state, action) => {
        const index = state.lugares.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.lugares[index] = action.payload;
      })
<<<<<<< HEAD

      // Eliminar Lugar
      .addCase(deleteLugar.fulfilled, (state, action) => {
        state.lugares = state.lugares.filter((l) => l.id !== action.payload);
      })

      // Cambiar Estado Lugar
=======
      .addCase(deleteLugar.fulfilled, (state, action) => {
        state.lugares = state.lugares.filter((l) => l.id !== action.payload);
      })
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
      .addCase(toggleEstadoLugar.fulfilled, (state, action) => {
        const index = state.lugares.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.lugares[index] = action.payload;
      });
  },
});

<<<<<<< HEAD
export default lugaresSlice.reducer;
=======
export default lugaresSlice.reducer;
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
