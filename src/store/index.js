import rolesReducer from './roles/rolesSlice';
import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from './usuarios/usuariosSlice';
import categoriasReducer from './categorias/categoriasSlice';
import lugaresReducer from './lugares/lugaresSlice';
import reservasReducer from './reservas/reservasSlice'; 
import eventosReducer from './eventos/eventosSlice'; 

const store = configureStore({
  reducer: {
    roles: rolesReducer,
    usuarios: usuariosReducer,
    categorias: categoriasReducer,
    lugares: lugaresReducer,
    reservas: reservasReducer,
    eventos: eventosReducer,
  },
});

export default store;
