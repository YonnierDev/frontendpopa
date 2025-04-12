import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api/api";

export const fetchLugares = createAsyncThunk('lugares/fetchLugares', async () => {
  const res = await api.get('/lugares');
  return res.data;
});

export const createLugar = createAsyncThunk('lugares/createLugar', async (nuevoLugar) => {
  const res = await api.post('/lugar', nuevoLugar);
  return res.data;
});

export const updateLugar = createAsyncThunk('lugares/updateLugar', async ({ id, datos }) => {
  const res = await api.put(`/lugar/${id}`, datos);
  return res.data;
});

export const deleteLugar = createAsyncThunk('lugares/deleteLugar', async (id) => {
  await api.delete(`/lugar/${id}`);
  return id;
});

export const toggleEstadoLugar = createAsyncThunk('lugares/toggleEstadoLugar', async ({ id, estado }) => {
  const res = await api.patch(`/lugar/estado/${id}`, { estado });
  return res.data.lugar;
});

const lugaresSlice = createSlice({
  name: 'lugares',
  initialState: {
    lugares: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(createLugar.fulfilled, (state, action) => {
        state.lugares.push(action.payload);
      })
      .addCase(updateLugar.fulfilled, (state, action) => {
        const index = state.lugares.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.lugares[index] = action.payload;
      })
      .addCase(deleteLugar.fulfilled, (state, action) => {
        state.lugares = state.lugares.filter((l) => l.id !== action.payload);
      })
      .addCase(toggleEstadoLugar.fulfilled, (state, action) => {
        const index = state.lugares.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.lugares[index] = action.payload;
      });
  },
});

export default lugaresSlice.reducer;
