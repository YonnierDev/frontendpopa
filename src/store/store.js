import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import lugaresReducer from './lugares/lugaresSlice';
import eventosReducer from './eventos/eventosSlice';
import categoriasReducer from './categorias/categoriasSlice';
import usuariosReducer from './usuarios/usuariosSlice';
import rolesReducer from './roles/rolesSlice';
import reservasReducer from './reservas/reservasSlice';
import trabajoSolicitudesReducer from '../features/trabajoSolicitudes/trabajoSolicitudesSlice';

export const store = configureStore({
  reducer: {
    categorias: categoriasReducer,
    lugares: lugaresReducer,
    eventos: eventosReducer,
    auth: authReducer,
    reservas: reservasReducer,
    trabajoSolicitudes: trabajoSolicitudesReducer
  }
});

export default store;
