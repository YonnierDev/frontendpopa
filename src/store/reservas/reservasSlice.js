import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../components/api/api";

// GET all reservas
export const fetchReservas = createAsyncThunk("reservas/fetchReservas", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/reservas");
    return res.data;
  } catch (error) {
    return rejectWithValue("Error al obtener reservas");
  }
});

// POST crear reserva
export const createReserva = createAsyncThunk("reservas/createReserva", async (nuevaReserva, { rejectWithValue }) => {
  try {
    const res = await api.post("/reserva", nuevaReserva);
    return res.data;
  } catch (error) {
    return rejectWithValue("Error al crear reserva");
  }
});

// PUT actualizar reserva
export const updateReserva = createAsyncThunk("reservas/updateReserva", async ({ id, reserva }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/reserva/${id}`, reserva);
    return res.data.reservaActualizada;
  } catch (error) {
    return rejectWithValue("Error al actualizar reserva");
  }
});

// DELETE eliminar reserva
export const deleteReserva = createAsyncThunk("reservas/deleteReserva", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/reserva/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue("Error al eliminar reserva");
  }
});

// PATCH cambiar estado
export const toggleEstadoReserva = createAsyncThunk("reservas/toggleEstado", async ({ id, estado }, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/reserva/estado/${id}`, { estado });
    return res.data;
  } catch (error) {
    return rejectWithValue("Error al cambiar estado de reserva");
  }
});

const reservasSlice = createSlice({
  name: "reservas",
  initialState: {
    reservas: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReservas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservas.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(fetchReservas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReserva.fulfilled, (state, action) => {
        state.reservas.push(action.payload);
      })
      .addCase(createReserva.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateReserva.fulfilled, (state, action) => {
        const index = state.reservas.findIndex(r => r.id === action.payload.id);
        if (index !== -1) state.reservas[index] = action.payload;
      })
      .addCase(updateReserva.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteReserva.fulfilled, (state, action) => {
        state.reservas = state.reservas.filter(r => r.id !== action.payload);
      })
      .addCase(deleteReserva.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(toggleEstadoReserva.fulfilled, (state, action) => {
        const index = state.reservas.findIndex(r => r.id === action.payload.reserva?.id);
        if (index !== -1) state.reservas[index] = action.payload.reserva;
      })
      .addCase(toggleEstadoReserva.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default reservasSlice.reducer;
