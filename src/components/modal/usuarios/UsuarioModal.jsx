import React from "react";

const UsuarioModal = ({
  isOpen,
  onClose,
  onSubmit,
  form,
  handleChange,
  modoEdicion,
  roles = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="usuario-modal">
      <div className="modal-overlay">
        <div className="modal-content" role="dialog" aria-modal="true">
          <h2 className="modal-title">
            {modoEdicion ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <form onSubmit={onSubmit} className="modal-form">
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            <input
              name="correo"
              placeholder="Correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              required
            />
            <input
              name="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              required
            />
            <select
              name="genero"
              value={form.genero}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>

            {/* Selector de Rol */}
            <select
              name="rol_id"
              value={form.rol_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>

            {!modoEdicion && (
              <input
                name="contrasena"
                placeholder="Contraseña"
                type="password"
                value={form.contrasena}
                onChange={handleChange}
                required
              />
            )}
            <div className="modal-actions">
              <button type="submit" className="btn btn-success">
                {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
              </button>
              <button type="button" className="btn btn-delete" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsuarioModal;
