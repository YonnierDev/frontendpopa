import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../api/api"; 

// Acción para obtener el perfil
export const obtenerPerfil = createAsyncThunk(
  'perfil/obtenerPerfil',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/perfil');
      return response.data;  // Retornamos la respuesta con el perfil
    } catch (error) {
      return rejectWithValue(error.response.data);  // Retornamos el error en caso de fallo
    }
  }
);

// Acción para actualizar el perfil
export const actualizarPerfil = createAsyncThunk(
  'perfil/actualizarPerfil',
  async (perfilData, { rejectWithValue }) => {
    try {
      const response = await api.put('/perfil', perfilData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Esto es importante cuando subimos imágenes
        },
      });
      return response.data;  // Retornamos la respuesta con el perfil actualizado
    } catch (error) {
      return rejectWithValue(error.response.data);  // Retornamos el error en caso de fallo
    }
  }
);

const perfilSlice = createSlice({
  name: 'perfil',
  initialState: {
    perfil: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Aquí podrías agregar más acciones si es necesario
  },
  extraReducers: (builder) => {
    builder
      // Caso para obtener el perfil
      .addCase(obtenerPerfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerPerfil.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload;  // Guardamos el perfil obtenido
      })
      .addCase(obtenerPerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje || 'Error al obtener el perfil';  // Error si no se obtiene
      })

      // Caso para actualizar el perfil
      .addCase(actualizarPerfil.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarPerfil.fulfilled, (state, action) => {
        state.loading = false;
        state.perfil = action.payload.usuario;  // Guardamos el perfil actualizado
      })
      .addCase(actualizarPerfil.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje || 'Error al actualizar perfil';  // Error si no se actualiza
      });
  },
});

export default perfilSlice.reducer;
