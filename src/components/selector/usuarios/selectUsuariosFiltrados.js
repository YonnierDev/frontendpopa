import { createSelector } from 'reselect';

const selectUsuarios = (state) => state.usuarios.usuarios;
const selectFiltro = (state) => state.usuarios.filtro;

export const selectUsuariosFiltrados = createSelector(
  [selectUsuarios, selectFiltro],
  (usuarios, filtro) => {
    if (!filtro) return usuarios;
    const filtroLower = filtro.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(filtroLower) ||
        u.apellido.toLowerCase().includes(filtroLower) ||
        u.correo.toLowerCase().includes(filtroLower)
    );
  }
);
