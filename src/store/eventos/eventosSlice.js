import { api } from "../../components/api/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// GET /eventos
export const fetchEventos = createAsyncThunk("eventos/fetchEventos", async (_, thunkAPI) => {
  try {
    const response = await api.get("/eventos");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.mensaje || "Error al listar eventos");
  }
});

// POST /evento
export const createEvento = createAsyncThunk("eventos/createEvento", async (evento, thunkAPI) => {
  try {
    const response = await api.post("/evento", evento);
    return response.data.evento;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.mensaje || "Error al crear evento");
  }
});

// PUT /evento/:id
export const updateEvento = createAsyncThunk("eventos/updateEvento", async ({ id, evento }, thunkAPI) => {
  try {
    const response = await api.put(`/evento/${id}`, evento);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.mensaje || "Error al actualizar evento");
  }
});

// PATCH /evento/estado/:id
export const toggleEstadoEvento = createAsyncThunk(
  "eventos/toggleEstadoEvento",
  async ({ id, estado }, thunkAPI) => {
    try {
      await api.patch(`/evento/estado/${id}`, { estado });
      return { id, estado };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.mensaje || "Error al cambiar estado del evento");
    }
  }
);

// DELETE /evento/:id
export const deleteEvento = createAsyncThunk("eventos/deleteEvento", async (id, thunkAPI) => {
  try {
    await api.delete(`/evento/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.mensaje || "Error al eliminar evento");
  }
});

const eventosSlice = createSlice({
  name: "eventos",
  initialState: {
    eventos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchEventos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventos.fulfilled, (state, action) => {
        state.loading = false;
        state.eventos = action.payload;
      })
      .addCase(fetchEventos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createEvento.fulfilled, (state, action) => {
        state.eventos.push(action.payload);
      })
      .addCase(createEvento.rejected, (state, action) => {
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateEvento.fulfilled, (state, action) => {
        const index = state.eventos.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.eventos[index] = action.payload;
        }
      })
      .addCase(updateEvento.rejected, (state, action) => {
        state.error = action.payload;
      })

      // TOGGLE ESTADO
      .addCase(toggleEstadoEvento.fulfilled, (state, action) => {
        const evento = state.eventos.find((e) => e.id === action.payload.id);
        if (evento) {
          evento.estado = action.payload.estado;
        }
      })
      .addCase(toggleEstadoEvento.rejected, (state, action) => {
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteEvento.fulfilled, (state, action) => {
        state.eventos = state.eventos.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEvento.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default eventosSlice.reducer;
