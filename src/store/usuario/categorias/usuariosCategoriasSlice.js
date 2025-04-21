import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../../api/api'; 

// Async thunk para obtener las categorías
export const fetchCategorias = createAsyncThunk('categorias/fetchCategorias', async () => {
  const response = await api.get('/categorias');
  console.log('Respuesta de la API:', response.data);
  return response.data;
});

// Async thunk para obtener lugares por categoría
export const fetchLugaresPorCategoria = createAsyncThunk('categorias/fetchLugaresPorCategoria', async (categoriaId) => {
  const response = await api.get(`/categoria/${categoriaId}/lugares`);
  console.log('Lugares por categoría:', response.data);
  return response.data;
});

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState: {
    categorias: [],
    lugares: [],   // añadimos lugares aquí
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Manejo de categorías
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        console.log('Categorías cargadas:', action.payload);
        state.loading = false;
        state.categorias = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Manejo de lugares por categoría
      .addCase(fetchLugaresPorCategoria.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLugaresPorCategoria.fulfilled, (state, action) => {
        console.log('Lugares cargados:', action.payload);
        state.loading = false;
        state.lugares = action.payload;
      })
      .addCase(fetchLugaresPorCategoria.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoriasSlice.reducer;
