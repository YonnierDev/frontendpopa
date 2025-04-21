import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/api';

// Thunks
export const fetchEventos = createAsyncThunk(
  'eventos/fetchEventos',
  async () => {
    const response = await api.get('/eventos');
    return response.data;
  }
);

export const fetchEventosByLugar = createAsyncThunk(
  'eventos/fetchEventosByLugar',
  async (lugarId) => {
    const response = await api.get(`/eventos/lugar/${lugarId}`);
    return response.data;
  }
);

export const createEvento = createAsyncThunk(
  'eventos/createEvento',
  async (eventoData) => {
    const response = await api.post('/eventos', eventoData);
    return response.data;
  }
);

const eventosSlice = createSlice({
  name: 'eventos',
  initialState: {
    eventos: [],
    eventosByLugar: {},
    loading: false,
    error: null,
    currentEvento: null
  },
  reducers: {
    setCurrentEvento: (state, action) => {
      state.currentEvento = action.payload;
    },
    clearCurrentEvento: (state) => {
      state.currentEvento = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEventos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventos.fulfilled, (state, action) => {
        state.loading = false;
        state.eventos = action.payload;
      })
      .addCase(fetchEventos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEventosByLugar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventosByLugar.fulfilled, (state, action) => {
        state.loading = false;
        state.eventosByLugar[action.meta.arg] = action.payload;
      })
      .addCase(fetchEventosByLugar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEvento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvento.fulfilled, (state, action) => {
        state.loading = false;
        state.eventos.push(action.payload);
      })
      .addCase(createEvento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setCurrentEvento, clearCurrentEvento } = eventosSlice.actions;
export default eventosSlice.reducer;
