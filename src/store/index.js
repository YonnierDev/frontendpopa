import { configureStore } from '@reduxjs/toolkit';
import rolesReducer from './roles/rolesSlice';
import usuariosReducer from './usuarios/usuariosSlice';

const store = configureStore({
  reducer: {
    roles: rolesReducer,
    usuarios: usuariosReducer,
  },
});

export default store;
