import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/api';

// Thunks
export const fetchReservas = createAsyncThunk(
  'reservas/fetchReservas',
  async () => {
    const response = await api.get('/reservas');
    return response.data;
  }
);

export const fetchReservasByEvento = createAsyncThunk(
  'reservas/fetchReservasByEvento',
  async (eventoId) => {
    const response = await api.get(`/reservas/evento/${eventoId}`);
    return response.data;
  }
);

export const fetchReservasByUsuario = createAsyncThunk(
  'reservas/fetchReservasByUsuario',
  async (usuarioId) => {
    const response = await api.get(`/reservas/usuario/${usuarioId}`);
    return response.data;
  }
);

export const createReserva = createAsyncThunk(
  'reservas/createReserva',
  async (reservaData) => {
    const response = await api.post('/reservas', reservaData);
    return response.data;
  }
);

export const updateReservaStatus = createAsyncThunk(
  'reservas/updateReservaStatus',
  async ({ reservaId, status }) => {
    const response = await api.patch(`/reservas/${reservaId}/status`, { status });
    return response.data;
  }
);

const reservasSlice = createSlice({
  name: 'reservas',
  initialState: {
    reservas: [],
    reservasByEvento: {},
    reservasByUsuario: {},
    loading: false,
    error: null,
    currentReserva: null
  },
  reducers: {
    setCurrentReserva: (state, action) => {
      state.currentReserva = action.payload;
    },
    clearCurrentReserva: (state) => {
      state.currentReserva = null;
    }
  },
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
        state.error = action.error.message;
      })
      .addCase(fetchReservasByEvento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservasByEvento.fulfilled, (state, action) => {
        state.loading = false;
        state.reservasByEvento[action.meta.arg] = action.payload;
      })
      .addCase(fetchReservasByEvento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchReservasByUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservasByUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.reservasByUsuario[action.meta.arg] = action.payload;
      })
      .addCase(fetchReservasByUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas.push(action.payload);
      })
      .addCase(createReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateReservaStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReservaStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservas.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reservas[index] = action.payload;
        }
      })
      .addCase(updateReservaStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setCurrentReserva, clearCurrentReserva } = reservasSlice.actions;
export default reservasSlice.reducer;
