<<<<<<< HEAD
=======
# Frontend de Gestión de Usuarios y Lugares

Este es el frontend de una aplicación web construida con **React 19** y **Vite**, que permite gestionar usuarios, roles y lugares. Incluye funcionalidades como autenticación, registro, validación de correo por código, edición y eliminación de usuarios, además de visualización por rol.

---

## Tecnologías utilizadas

- **React 19**
- **Vite 6**
- **React Router DOM 7**
- **Axios**
- **React Toastify** (alertas)
- **Bootstrap 5.3**
- **React Switch** (interruptores de estado)

---

## Estructura del proyecto

```
frontend/
│
├── public/                 # Archivos públicos
├── src/
│   ├── components/         # Componentes comunes (navbar, header, footer, alertas)
│   ├── pages/              # Páginas principales: login, register, usuarios, lugares
│   ├── api/                # Servicios API para usuarios y otros recursos
│   ├── App.jsx             # Configuración de rutas
│   └── main.jsx            # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```

---

## Requisitos

- Node.js >= 18.x
- npm >= 9.x

---

## Instalación

```bash
# 1. Clonar el repositorio o copiar el proyecto
cd frontend

# 2. Instalar dependencias
npm install
```

## Scripts disponibles

```bash
# Levanta el frontend en modo desarrollo
npm run dev


## Configuración de entorno

Si necesitas conectar a una API, puedes configurar un archivo `.env` en la raíz con:

```env
VITE_API_BASE_URL=http://localhost:3000/api  despliegue https://popnocturna-git-main-yonnierdevs-projects.vercel.app/api
```

Y dentro de tu código puedes acceder con `import.meta.env.VITE_API_BASE_URL`.

---

## Funcionalidades destacadas

- Inicio de sesión con token JWT
- Registro de usuario
- Validación de correo por código
- Gestión de usuarios y roles
- Cambio de estado (activo/inactivo)
- CRUD de lugares (en desarrollo)
- Rutas protegidas por autenticación

---

## Buenas prácticas

- Código modular
- Separación por componentes
- Uso de servicios centralizados (`api/`) para peticiones HTTP
- Control de estado con hooks (`useState`, `useEffect`)
- Validaciones básicas de formulario

## USUARIOS 

- administrador@gmail.com   Admin123
- propietario@gmail.com     Prop1234
- usuario@gmail.com         User1234
>>>>>>> ccc46c449c7b88d96706a7a04dd4d76f73543425
