import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../../components/api/api";  

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const res = await api.get('/roles');
  return res.data;
});

export const createRol = createAsyncThunk('roles/createRol', async (nombre) => {
  const res = await api.post('/rol', { nombre });
  const rol = res.data;
  return { ...rol, id: rol.id || rol._id }; 
});

export const updateRol = createAsyncThunk('roles/updateRol', async ({ id, nombre }) => {
  const res = await api.put(`/rol/${id}`, { nombre });
  const rol = res.data.rolActualizado;
  return { ...rol, id: rol.id || rol._id };
});

export const deleteRol = createAsyncThunk('roles/deleteRol', async (id) => {
  await api.delete(`/rol/${id}`);
  return id;
});

// Slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createRol.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRol.fulfilled, (state, action) => {
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.roles[index] = action.payload;
      })
      .addCase(deleteRol.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      });
  },
});

export default rolesSlice.reducer;
