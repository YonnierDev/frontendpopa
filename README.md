# Frontend Pop Nocturna

# Frontend Pop Nocturna

## 1. Tecnologías Globales y su Implementación

### Core del Proyecto

1. **React 18**
   - **¿Qué es?** Framework principal de JavaScript para UI
   - **¿Cómo se usa?** 
     - Componentes funcionales con hooks
     - Estados locales y globales
     - Manejo de efectos secundarios
   - **¿Por qué se eligió?** Rendimiento, ecosistema y comunidad activa

2. **Vite**
   - **¿Qué es?** Bundler y servidor de desarrollo
   - **¿Cómo se usa?**
     - Configuración mínima en vite.config.js
     - Hot Module Replacement (HMR)
   - **¿Por qué se eligió?** Rapidez en desarrollo y build

### Routing y Navegación

1. **React Router DOM**
   - **¿Qué es?** Sistema de navegación para React
   - **¿Cómo se usa?**
     - Definición de rutas en App.jsx
     - Protección de rutas con PrivateRoute
   - **¿Por qué se eligió?** Estándar de la industria, fácil de usar

### Manejo de Datos

1. **Axios**
   - **¿Qué es?** Cliente HTTP para llamadas a API
   - **¿Cómo se usa?**
     - Instancia configurada con base URL
     - Interceptores para tokens
   - **¿Por qué se eligió?** Robusto manejo de errores y configuración

2. **React Query**
   - **¿Qué es?** Gestión de estado del servidor
   - **¿Cómo se usa?**
     - Hooks para fetch de datos
     - Caché automático
   - **¿Por qué se eligió?** Optimización de rendimiento

### UI/UX

1. **Material-UI**
   - **¿Qué es?** Biblioteca de componentes React
   - **¿Cómo se usa?**
     - Componentes prediseñados
     - Sistema de temas
   - **¿Por qué se eligió?** Diseño profesional y consistente

2. **React Icons**
   - **¿Qué es?** Biblioteca de iconos
   - **¿Cómo se usa?**
     - Importación por demanda
     - Uso como componentes
   - **¿Por qué se eligió?** Variedad y optimización

### Formularios y Validación

1. **React Hook Form**
   - **¿Qué es?** Manejo de formularios
   - **¿Cómo se usa?**
     - Hooks para validación
     - Manejo de errores
   - **¿Por qué se eligió?** Rendimiento y facilidad de uso

2. **Yup**
   - **¿Qué es?** Validación de esquemas
   - **¿Cómo se usa?**
     - Definición de esquemas
     - Integración con React Hook Form
   - **¿Por qué se eligió?** Validaciones robustas y tipadas

## 2. Panel de SuperAdmin

### Flujo de Desarrollo

1. **Configuración Inicial**
   - Creación de estructura de carpetas
   - Configuración de rutas protegidas
   - Setup de autenticación

2. **Servicios (Primera Capa)**
   - authService: Manejo de autenticación
   - userService: Operaciones CRUD de usuarios
   - eventService: Gestión de eventos
   - placeService: Gestión de lugares

3. **Controladores (Segunda Capa)**
   - userController: Lógica de negocio usuarios
   - eventController: Lógica de eventos
   - placeController: Lógica de lugares
   - requestController: Lógica de solicitudes

4. **Rutas (Tercera Capa)**
   - /superadmin/users: Gestión de usuarios
   - /superadmin/events: Gestión de eventos
   - /superadmin/places: Gestión de lugares
   - /superadmin/requests: Solicitudes pendientes

### Librerías Específicas del Panel

1. **React Table**
   - **Propósito**: Tablas de datos complejas
   - **Uso**: Listados de usuarios, eventos y lugares

2. **React DatePicker**
   - **Propósito**: Selección de fechas
   - **Uso**: Filtros de eventos y reportes

3. **React Select**
   - **Propósito**: Selectores avanzados
   - **Uso**: Filtros y formularios

4. **React Toastify**
   - **Propósito**: Notificaciones al usuario
   - **Uso**: Feedback de operaciones

### Características Principales

1. **Gestión de Usuarios**
   - CRUD completo
   - Asignación de roles
   - Historial de acciones

2. **Gestión de Eventos**
   - Aprobación/Rechazo
   - Calendario integrado
   - Gestión de imágenes

3. **Gestión de Lugares**
   - Validación de documentos
   - Gestión de ubicaciones
   - Control de aforo

4. **Solicitudes Pendientes**
   - Cola de aprobaciones
   - Notificaciones automáticas
   - Seguimiento de estados

## 3. Implementación del Panel SuperAdmin

### Orden de Desarrollo

1. **Preparación del Entorno**
   - Instalación de dependencias necesarias
   - Configuración del entorno de desarrollo
   - Estructura base del proyecto

2. **Implementación por Capas**

   a. **Primera Capa: Servicios**
   - Conexión con el backend
   - Manejo de autenticación
   - Gestión de datos

   b. **Segunda Capa: Controladores**
   - Lógica de negocio
   - Validaciones
   - Transformación de datos

   c. **Tercera Capa: Componentes**
   - Interfaces de usuario
   - Formularios
   - Tablas y listados

### Dependencias Principales

1. **Gestión de Estado**
   - Redux Toolkit: Estado global
   - React Query: Cache y sincronización

2. **Interfaz de Usuario**
   - Material-UI: Componentes base
   - React Table: Tablas de datos
   - React Hook Form: Formularios

3. **Utilidades**
   - Date-fns: Manejo de fechas
   - Axios: Peticiones HTTP
   - Yup: Validaciones

### Flujo de Trabajo

1. **Autenticación**
   - Login de SuperAdmin
   - Manejo de tokens
   - Rutas protegidas

2. **Gestión de Datos**
   - Peticiones al backend
   - Caché de datos
   - Actualizaciones en tiempo real

3. **Interacción de Usuario**
   - Formularios con validación
   - Feedback inmediato
   - Notificaciones

### Estructura de Archivos

```
src/
└── pages/
    └── SuperAdmin/
        ├── services/      # Capa de servicios
        ├── controllers/   # Capa de controladores
        ├── components/    # Componentes UI
        └── routes/        # Definición de rutas
```

### Guía de Implementación

1. **Servicios (Primera Capa)**
   - Implementar servicios base
   - Configurar interceptores
   - Manejar errores globales

2. **Controladores (Segunda Capa)**
   - Desarrollar lógica de negocio
   - Implementar validaciones
   - Gestionar estado

3. **Componentes (Tercera Capa)**
   - Crear interfaces de usuario
   - Implementar formularios
   - Desarrollar vistas

### Seguridad

1. **Autenticación**
   - JWT para tokens
   - Refresh tokens
   - Manejo de sesiones

2. **Autorización**
   - Control de roles
   - Permisos granulares
   - Rutas protegidas

### Optimización

1. **Rendimiento**
   - Lazy loading
   - Memorización
   - Code splitting

2. **Caché**
   - Estrategias de caché
   - Invalidación
   - Revalidación


## Arquitectura del Proyecto

### Estructura de Directorios Detallada
```bash
src/
├── components/                 # Componentes Reutilizables
│   ├── common/                 # Componentes Base
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── layout/                 # Componentes de Estructura
│   │   ├── Navbar/
│   │   └── Sidebar/
│   └── forms/                  # Componentes de Formularios
├── pages/
│   ├── SuperA/                 # Panel SuperAdmin
│   │   ├── components/         # Componentes Específicos
│   │   │   ├── SidebarSuper/   # Navegación Principal
│   │   │   └── SuperAdminStats/# Dashboard Stats
│   │   ├── modules/            # Módulos Funcionales
│   │   │   ├── usuarios/       # Gestión de Usuarios
│   │   │   ├── eventos/        # Gestión de Eventos
│   │   │   └── lugares/        # Gestión de Lugares
│   │   └── services/           # Servicios API
│   └── Auth/                   # Autenticación
├── hooks/                      # Custom Hooks
│   ├── useAuth.js             # Hook de Autenticación
│   └── usePagination.js       # Hook de Paginación
├── utils/                      # Utilidades
│   ├── api.js                  # Configuración API
│   └── validators.js           # Validadores
├── assets/                     # Recursos Estáticos
└── App.jsx                     # Punto de Entrada
```

### Patrones de Diseño Implementados

1. **Container/Presentational Pattern**
   ```javascript
   // Container Component
   const UsuariosSuperContainer = () => {
     const [usuarios, setUsuarios] = useState([]);
     const { data, loading } = useUsuarios();
     
     return <UsuariosSuperView usuarios={usuarios} loading={loading} />;
   };

   // Presentational Component
   const UsuariosSuperView = ({ usuarios, loading }) => {
     return loading ? <Loader /> : <UsuariosTable data={usuarios} />;
   };
   ```

2. **Custom Hooks Pattern**
   ```javascript
   // hooks/useUsuarios.js
   const useUsuarios = () => {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       fetchUsuarios();
     }, []);

     return { data, loading };
   };
   ```

## Metodologías Implementadas

### 1. Arquitectura Modular
- **Componentes Independientes**: Cada funcionalidad está encapsulada en su propio componente.
- **Separación de Responsabilidades**: Cada módulo maneja su propia lógica y estado.

### 2. Gestión de Estado
- **Estado Local**: Uso de useState para gestión de estado a nivel de componente.
- **Efectos**: useEffect para manejar efectos secundarios y llamadas a API.

### 3. Seguridad
- **Autenticación**: Sistema de tokens JWT.
- **Rutas Protegidas**: Implementación de PrivateRoute para proteger rutas sensibles.

## Panel de SuperAdmin - Guía Estructural

### 1. Estructura de Carpetas

```
src/pages/SuperA/
├── components/       # Componentes compartidos del panel
├── services/        # Servicios y llamadas a API
├── styles/          # Estilos CSS por componente
└── utils/           # Utilidades y helpers
```

### 2. Orden de Componentes y sus Funciones

#### A. Componentes Base (Nivel 1)

1. **SuperAdminPanel.jsx**
   - Componente principal que actúa como layout
   - Maneja la autenticación del superadmin
   - Controla la navegación principal

2. **SidebarSuper.jsx**
   - Barra lateral de navegación
   - Muestra menú de opciones
   - Indica número de solicitudes pendientes

#### B. Módulos Principales (Nivel 2)

1. **UsuariosSuper.jsx**
   - Gestión completa de usuarios
   - Crear, editar, eliminar usuarios
   - Asignar roles y permisos

2. **EventosSuper.jsx**
   - Administración de eventos
   - Aprobar/rechazar eventos
   - Gestionar fechas y ubicaciones

3. **LugaresSuper.jsx**
   - Control de locaciones
   - Verificar documentación
   - Aprobar establecimientos

4. **PendientesSuper.jsx**
   - Ver solicitudes pendientes
   - Aprobar/rechazar solicitudes
   - Notificar a usuarios

### 3. Flujo de Datos

```
Usuario → SidebarSuper → Módulo Específico → Servicio API → Backend
```

### 4. Servicios (services/)

1. **userService.js**
   - Gestionar usuarios
   - Manejar roles
   - Actualizar perfiles

2. **eventService.js**
   - Crear eventos
   - Actualizar información
   - Gestionar asistentes

3. **locationService.js**
   - Registrar lugares
   - Validar documentos
   - Actualizar estados

### 5. Utilidades (utils/)

1. **auth.js**
   - Validar permisos
   - Verificar roles
   - Manejar tokens

2. **formatter.js**
   - Formatear fechas
   - Validar datos
   - Convertir formatos

### 6. Proceso de Trabajo

1. **Inicio de Sesión**
   - Autenticación como SuperAdmin
   - Carga de permisos
   - Redirección al dashboard

2. **Dashboard**
   - Vista general de estadísticas
   - Acceso rápido a funciones
   - Notificaciones importantes

3. **Gestión de Módulos**
   - Selección de módulo en sidebar
   - Carga de datos específicos
   - Realización de operaciones

### 7. Características por Módulo

#### Usuarios
- Crear nuevos usuarios
- Asignar roles
- Gestionar permisos
- Editar perfiles

#### Eventos
- Aprobar eventos nuevos
- Gestionar calendario
- Modificar detalles
- Control de asistencia

#### Lugares
- Validar documentación
- Aprobar establecimientos
- Gestionar ubicaciones
- Control de aforo

#### Pendientes
- Ver solicitudes nuevas
- Procesar aprobaciones
- Enviar notificaciones
- Seguimiento de estados

1. **SidebarSuper (Navegación Principal)**
   ```javascript
   // components/SidebarSuper/index.jsx
   const SidebarSuper = () => {
     const [isCollapsed, setIsCollapsed] = useState(false);
     const [cantidadSolicitudes, setCantidadSolicitudes] = useState(0);

     // Actualización en tiempo real de solicitudes
     useEffect(() => {
       const fetchSolicitudes = async () => {
         const response = await api.get('/lugares/pendientes');
         setCantidadSolicitudes(response.data.lugares.length);
       };
       
       fetchSolicitudes();
       const interval = setInterval(fetchSolicitudes, 60000);
       return () => clearInterval(interval);
     }, []);

     return (
       <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
         {/* Contenido del sidebar */}
       </nav>
     );
   };
   ```

2. **SuperAdminStats (Dashboard)**
   ```javascript
   // components/SuperAdminStats/index.jsx
   const SuperAdminStats = () => {
     const stats = useStats(); // Custom hook para estadísticas
     
     return (
       <div className="stats-grid">
         <StatCard
           title="Usuarios Activos"
           count={stats.activeUsers}
           icon={<FaUsers />}
           onClick={() => navigateToSection('usuarios')}
         />
         {/* Más tarjetas de estadísticas */}
       </div>
     );
   };
   ```

3. **Módulos Funcionales**

   a. **UsuariosSuper (Gestión de Usuarios)**
   ```javascript
   // modules/usuarios/UsuariosSuper.jsx
   const UsuariosSuper = () => {
     const { usuarios, loading, error } = useUsuarios();
     const { handleSubmit, validar } = useFormValidation();

     const onSubmit = async (data) => {
       try {
         // Validación de datos
         const isValid = await validar(data);
         if (!isValid) return;

         // Formateo de fecha
         const formattedData = {
           ...data,
           fecha_nacimiento: format(data.fecha_nacimiento, 'yyyy-MM-dd')
         };

         await api.post('/usuario', formattedData);
         toast.success('Usuario creado exitosamente');
       } catch (error) {
         handleError(error);
       }
     };

     return (
       <div className="usuarios-container">
         <DataTable
           data={usuarios}
           loading={loading}
           columns={usuariosColumns}
           actions={usuariosActions}
         />
         {/* Formularios y modales */}
       </div>
     );
   };
   ```

   b. **EventosSuper (Gestión de Eventos)**
   ```javascript
   // modules/eventos/EventosSuper.jsx
   const EventosSuper = () => {
     const [filtros, setFiltros] = useState({
       fecha: null,
       categoria: '',
       estado: ''
     });

     // Sistema de filtrado avanzado
     const eventosFiltrados = useMemo(() => {
       return eventos.filter(evento => {
         const cumpleFecha = !filtros.fecha || isSameDay(evento.fecha, filtros.fecha);
         const cumpleCategoria = !filtros.categoria || evento.categoria === filtros.categoria;
         const cumpleEstado = !filtros.estado || evento.estado === filtros.estado;
         return cumpleFecha && cumpleCategoria && cumpleEstado;
       });
     }, [eventos, filtros]);

     // Carga de imágenes con preview
     const handleImageUpload = async (file) => {
       const formData = new FormData();
       formData.append('imagen', file);
       
       try {
         const response = await api.post('/upload', formData);
         return response.data.url;
       } catch (error) {
         toast.error('Error al cargar la imagen');
       }
     };

     return (
       <div className="eventos-container">
         <FiltrosEvento onChange={setFiltros} />
         <EventosGrid eventos={eventosFiltrados} />
       </div>
     );
   };
   ```

   c. **LugaresSuper (Gestión de Lugares)**
   - Sistema de aprobación con workflow:
     1. Recepción de solicitud
     2. Validación de documentación
     3. Verificación de ubicación
     4. Aprobación/Rechazo final

   d. **PendientesSuper (Gestión de Solicitudes)**
   - Sistema de notificaciones en tiempo real usando WebSocket
   - Cola de prioridad para solicitudes urgentes
   - Sistema de seguimiento de estados

### Integraciones y Servicios

1. **Sistema de Notificaciones**
```javascript
// services/notifications.js
class NotificationService {
  constructor() {
    this.socket = io('wss://popnocturna.vercel.app');
    this.listeners = new Map();
  }

  subscribe(userId, callback) {
    this.socket.on(`notification:${userId}`, callback);
    this.listeners.set(userId, callback);
  }

  unsubscribe(userId) {
    const callback = this.listeners.get(userId);
    if (callback) {
      this.socket.off(`notification:${userId}`, callback);
      this.listeners.delete(userId);
    }
  }
}
```

2. **Sistema de Caché**
```javascript
// services/cache.js
const cache = new Map();

const withCache = (key, ttl = 5 * 60 * 1000) => async (fn) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

3. **Gestión de Permisos**
```javascript
// utils/permissions.js
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.ADMIN]: ['read:*', 'write:eventos', 'write:lugares'],
  [ROLES.MODERATOR]: ['read:*', 'write:comentarios']
};

const can = (userRole, action) => {
  const permissions = PERMISSIONS[userRole] || [];
  return permissions.includes('*') || permissions.includes(action);
};
```

### Flujo de Trabajo Recomendado

1. **Configuración Inicial**
   ```bash
   npm install        # Instalar dependencias
   npm run dev        # Iniciar servidor de desarrollo
   ```

2. **Orden de Implementación**
   1. Configurar rutas y navegación
   2. Implementar autenticación
   3. Configurar componentes base
   4. Agregar funcionalidades específicas

### Mejores Prácticas

1. **Desarrollo de Componentes**
   - Usar PropTypes para validación
   - Implementar manejo de errores
   - Mantener componentes pequeños y reutilizables

2. **Gestión de Estado**
   - Centralizar estado global cuando sea necesario
   - Usar callbacks para actualizaciones
   - Implementar memorización cuando sea necesario

3. **Optimización**
   - Lazy loading para rutas
   - Optimización de imágenes
   - Caché de datos cuando sea apropiado

## Mantenimiento

### Actualizaciones
```bash
# Actualizar dependencias
npm update

# Ejecutar tests
npm run test
```

### Despliegue
```bash
# Construir para producción
npm run build

# Previsualizar build
npm run preview
```

## Contribución
Para contribuir al proyecto:
1. Crear un fork
2. Crear una rama para tu feature
3. Hacer commit de tus cambios
4. Hacer push a la rama
5. Crear un Pull Request

## Licencia
Este proyecto está bajo la licencia MIT.
