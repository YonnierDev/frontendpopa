import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../components/api/api';

// Obtener todos los usuarios
export const fetchUsuarios = createAsyncThunk('usuarios/fetchUsuarios', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/usuarios');
    return res.data.map(u => ({ ...u, id: u.id || u._id }));
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Crear usuario
export const createUsuario = createAsyncThunk('usuarios/createUsuario', async (usuario, { rejectWithValue }) => {
  try {
    const res = await api.post('/usuario', usuario);
    const u = res.data;
    return { ...u, id: u.id || u._id };
  } catch (error) {
    console.error('Error al crear usuario:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Actualizar usuario
export const updateUsuario = createAsyncThunk('usuarios/updateUsuario', async ({ id, usuario }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/usuario/${id}`, usuario);
      return { ...res.data, id: res.data.id };
    } catch (error) {
      console.error("Error al actualizar:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// Eliminar usuario
export const deleteUsuario = createAsyncThunk('usuarios/deleteUsuario', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/usuario/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Cambiar estado
export const toggleEstadoUsuario = createAsyncThunk('usuarios/toggleEstadoUsuario', async ({ id, estado }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/usuario/estado/${id}`, { estado });
      return { ...res.data, id: res.data.id };
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  });

// Filtrar por rol
export const fetchUsuariosPorRol = createAsyncThunk('usuarios/fetchUsuariosPorRol', async (rolId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/usuarios/rol/${rolId}`);
    return res.data.map(u => ({ ...u, id: u.id || u._id }));
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState: {
    usuarios: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUsuario.fulfilled, (state, action) => {
        state.usuarios.push(action.payload);
      })
      .addCase(createUsuario.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUsuario.fulfilled, (state, action) => {
        const index = state.usuarios.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.usuarios[index] = action.payload;
      })
      .addCase(deleteUsuario.fulfilled, (state, action) => {
        state.usuarios = state.usuarios.filter(u => u.id !== action.payload);
      })
      .addCase(toggleEstadoUsuario.fulfilled, (state, action) => {
        const index = state.usuarios.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.usuarios[index] = action.payload;
      })
      .addCase(fetchUsuariosPorRol.fulfilled, (state, action) => {
        state.usuarios = action.payload;
      });
  }
});

export default usuariosSlice.reducer;
