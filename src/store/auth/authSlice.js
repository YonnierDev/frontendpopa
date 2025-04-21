import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setAuth, clearAuth, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
