import rolesReducer from './roles/rolesSlice';
import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from './usuarios/usuariosSlice';
import categoriasReducer from './categorias/categoriasSlice';
import lugaresReducer from './lugares/lugaresSlice';
import perfilReducer from "./perfil/perfilSlice";
import recuperacionReducer from "./recuperacion/recuperacionSlice";
import categoriasUsuariosReducer from "./usuario/categorias/usuariosCategoriasSlice";
import usuariosEventosReducer from "./usuario/eventos/usuariosEventosSlice";
import eventosReducer from './eventos/eventosSlice';
import reservasReducer from './reservas/reservasSlice';

const store = configureStore({
  reducer: {
    roles: rolesReducer,
    usuarios: usuariosReducer,
    categorias: categoriasReducer,
    lugares: lugaresReducer,
    
    //Header 
    perfil: perfilReducer,
    // Recuperacion de contraseña
    recuperacion: recuperacionReducer,

    //USUARIOS
    categoriasUsuarios: categoriasUsuariosReducer,
    usuariosEventos: usuariosEventosReducer,
    eventos: eventosReducer,
    reservas: reservasReducer,
  },
});

export default store;
