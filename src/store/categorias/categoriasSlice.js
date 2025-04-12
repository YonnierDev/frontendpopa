import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api/api";

export const fetchCategorias = createAsyncThunk(
  'categorias/fetchCategorias',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/categorias');
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createCategoria = createAsyncThunk(
  'categorias/createCategoria',
  async (tipo, thunkAPI) => {
    try {
      const res = await api.post('/categoria', { tipo });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateCategoria = createAsyncThunk(
  'categorias/updateCategoria',
  async ({ id, tipo }, thunkAPI) => {
    try {
      const res = await api.put(`/categoria/${id}`, { tipo });
      return res.data.categoriaActualizada;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategoria = createAsyncThunk(
  'categorias/deleteCategoria',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/categoria/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const toggleEstadoCategoria = createAsyncThunk(
  'categorias/toggleEstadoCategoria',
  async ({ id, estado }, thunkAPI) => {
    try {
      await api.patch(`/categoria/estado/${id}`, { estado });
      return { id, estado };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchLugaresPorCategoria = createAsyncThunk(
  'categorias/fetchLugaresPorCategoria',
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/categoria/${id}/lugares`);
      return { id, lugares: res.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: {
    categorias: [],
    loading: false,
    error: null,
    lugaresPorCategoria: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false;
        state.categorias = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategoria.fulfilled, (state, action) => {
        state.categorias.push(action.payload);
      })
      .addCase(updateCategoria.fulfilled, (state, action) => {
        const index = state.categorias.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categorias[index] = action.payload;
        }
      })
      .addCase(deleteCategoria.fulfilled, (state, action) => {
        state.categorias = state.categorias.filter(cat => cat.id !== action.payload);
      })
      .addCase(toggleEstadoCategoria.fulfilled, (state, action) => {
        const index = state.categorias.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categorias[index].estado = action.payload.estado;
        }
      })
      .addCase(fetchLugaresPorCategoria.fulfilled, (state, action) => {
        const { id, lugares } = action.payload;
        state.lugaresPorCategoria[id] = lugares;
      });
  },
});

export default categoriasSlice.reducer;
