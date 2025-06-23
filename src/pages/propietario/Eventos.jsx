import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from "../../components/api/api";
import Sidebar from '../../components/Sidebar';
import './Eventos.css';
import { toast } from 'react-toastify';

const Eventos = () => {
  // Hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lugarId = searchParams.get('lugarId');
  
  // States
  const [eventos, setEventos] = useState([]);
  const [comentariosEvento, setComentariosEvento] = useState({});
  const [eventoComentariosAbierto, setEventoComentariosAbierto] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const [lugares, setLugares] = useState([]);
  const [imagenModal, setImagenModal] = useState({ mostrar: false, url: '' });
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [eventoEditar, setEventoEditar] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  // Initialize nuevoEvento with lugarId if available
  const [nuevoEvento, setNuevoEvento] = useState(() => ({
    nombre: '',
    lugarid: lugarId || '',
    capacidad: '',
    precio: '',
    descripcion: '',
    fecha_hora: '',
    portada: []
  }));
  
  // Función para procesar las imágenes de portada de los eventos
  const procesarImagenesPortada = (portada) => {
    // URL de imagen por defecto (SVG en base64)
    const IMAGEN_POR_DEFECTO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBmaWxsPSIjZWVlZWVlIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PUFyaWFsIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5vIGhheSBpbWFnZW48L3RleHQ+PC9zdmc+';
    
    // Si no hay portada o es inválida, devolver la imagen por defecto
    if (!portada || portada === 'null' || portada === 'undefined' || portada === '[]') {
      return [IMAGEN_POR_DEFECTO];
    }
    
    try {
      // Si es un string, procesarlo
      if (typeof portada === 'string') {
        // Si es un string vacío o solo espacios, devolver imagen por defecto
        if (portada.trim() === '') return [IMAGEN_POR_DEFECTO];
        
        // Si es un string JSON, intentar parsearlo
        if ((portada.startsWith('[') && portada.endsWith(']')) || 
            (portada.startsWith('{') && portada.endsWith('}'))) {
          try {
            portada = JSON.parse(portada);
          } catch (e) {
            console.warn('No se pudo parsear el JSON de la imagen:', portada);
            return [IMAGEN_POR_DEFECTO];
          }
        } else {
          // Si es una URL directa o data URL, validarla
          if (portada.startsWith('http') || portada.startsWith('blob:') || portada.startsWith('data:image')) {
            return [portada];
          }
          // Si parece ser un nombre de archivo, construir la URL de Cloudinary
          if (portada.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            // Verificar si ya tiene el prefijo de Cloudinary
            if (!portada.includes('res.cloudinary.com')) {
              // Eliminar barras iniciales si las hay
              const cleanPath = portada.replace(/^[\\/]+/, '');
              return [`https://res.cloudinary.com/popaimagen/image/upload/${cleanPath}`];
            }
            return [portada];
          }
          return [IMAGEN_POR_DEFECTO];
        }
      }
      
      // Si es un array, procesar cada elemento
      if (Array.isArray(portada)) {
        if (portada.length === 0) return [IMAGEN_POR_DEFECTO];
        
        const imagenesProcesadas = [];
        
        for (const img of portada) {
          if (!img) continue;
          
          if (typeof img === 'string' && img.trim() !== '') {
            if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:image')) {
              imagenesProcesadas.push(img);
            } else if (img.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              const cleanPath = img.replace(/^[\\/]+/, '');
              imagenesProcesadas.push(`https://res.cloudinary.com/popaimagen/image/upload/${cleanPath}`);
            }
          } else if (typeof img === 'object' && img !== null) {
            // Si es un objeto, buscar propiedades que puedan contener URLs
            const urls = Object.values(img)
              .filter(val => typeof val === 'string' && val.trim() !== '')
              .filter(val => val.match(/^(http|blob:|data:image|\.*?\.(jpg|jpeg|png|gif|webp))/i));
              
            urls.forEach(url => {
              if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !url.startsWith('http')) {
                const cleanPath = url.replace(/^[\\/]+/, '');
                imagenesProcesadas.push(`https://res.cloudinary.com/popaimagen/image/upload/${cleanPath}`);
              } else {
                imagenesProcesadas.push(url);
              }
            });
          }
          
          // Limitar a 3 imágenes como máximo
          if (imagenesProcesadas.length >= 3) break;
        }
        
        return imagenesProcesadas.length > 0 ? imagenesProcesadas : [IMAGEN_POR_DEFECTO];
      }
      
      // Si es un objeto, buscar URLs de imagen en sus propiedades
      if (typeof portada === 'object' && portada !== null) {
        const urls = [];
        
        // Buscar en las propiedades del objeto
        for (const val of Object.values(portada)) {
          if (typeof val === 'string' && val.trim() !== '') {
            if (val.match(/^(http|blob:|data:image|\.*?\.(jpg|jpeg|png|gif|webp))/i)) {
              if (val.match(/\.(jpg|jpeg|png|gif|webp)$/i) && !val.startsWith('http')) {
                const cleanPath = val.replace(/^[\\/]+/, '');
                urls.push(`https://res.cloudinary.com/popaimagen/image/upload/${cleanPath}`);
              } else {
                urls.push(val);
              }
            }
          }
        }
        
        return urls.length > 0 ? urls : [IMAGEN_POR_DEFECTO];
      }
      
      // Si no coincide con ningún formato conocido, devolver imagen por defecto
      return [IMAGEN_POR_DEFECTO];
      
    } catch (error) {
      console.error('Error procesando imágenes de portada:', error);
      return [IMAGEN_POR_DEFECTO];
    }
  };

  // URL de imagen de respaldo segura
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIyIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHg9IjIiIHk9IjQiIHJ4PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iMTAuNSIgcj0iMi41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==';

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const token = localStorage.getItem('token');
      
      if (!usuario || !token) {
        console.log('No hay usuario o token, redirigiendo a login');
        toast.error('Debes iniciar sesión para acceder a esta página');
        navigate('/login');
        return;
      }
      
      // Verificar si el rol es el correcto
      if (parseInt(usuario.rol) !== 3) {
        console.log('Rol no autorizado, redirigiendo a dashboard');
        toast.error('No tienes permiso para acceder a esta sección');
        navigate('/propietario/dashboard');
        return;
      }
      
      // Cargar datos
      try {
        // Establecer el lugarId en el estado si está disponible
        if (lugarId) {
          setNuevoEvento(prev => ({
            ...prev,
            lugarid: lugarId
          }));
        }
        
        await Promise.all([
          cargarLugares(),
          cargarEventos()
        ]);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    
    cargarDatosIniciales();
  }, [navigate]); // Eliminamos lugarId de las dependencias para evitar bucles

  useEffect(() => {
    function updateNavbarHeight() {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        document.documentElement.style.setProperty('--navbar-height', navbar.offsetHeight + 'px');
      }
    }
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  // Las funciones cargarEventos y cargarLugares se llaman desde el efecto de autenticación

  const cargarEventos = async () => {
    setLoading(true);
    try {
      // Si ya tenemos el lugarId, cargar solo los eventos de ese lugar
      if (lugarId) {
        try {
          console.log(`Obteniendo eventos activos para el lugar: ${lugarId}`);
          const response = await api.get(`/api/propietario/lugares/${lugarId}/eventos-activos`);
          
          // Verificar si la respuesta es exitosa y tiene eventos
          if (response.data?.success) {
            const eventos = Array.isArray(response.data.eventos) ? response.data.eventos : [];
            console.log(`✅ Eventos encontrados: ${eventos.length}`);
            
            // Procesar las imágenes de portada
            const eventosProcesados = eventos.map(evento => ({
              ...evento,
              // Asegurarse de que portada sea un array
              portada: procesarImagenesPortada(evento.portada)
            }));
            
            setEventos(eventosProcesados);
            setMensaje(eventosProcesados.length === 0 ? 'No hay eventos activos para este lugar' : '');
          } else {
            console.log('No se encontraron eventos para este lugar');
            setEventos([]);
            setMensaje(response.data?.mensaje || 'No hay eventos activos para este lugar');
          }
        } catch (error) {
          console.error('Error al cargar eventos del lugar:', error);
          const errorMessage = error.response?.data?.mensaje || 'Error al cargar los eventos. Intenta de nuevo más tarde.';
          setMensaje(errorMessage);
          setEventos([]);
        } finally {
          setLoading(false);
        }
        return;
      }
      
      // Si no hay lugarId, cargar todos los lugares y luego sus eventos
      try {
        const lugaresResponse = await api.get('/api/propietario/lugares');
        const lugaresData = Array.isArray(lugaresResponse.data) ? lugaresResponse.data : [];
        
        if (lugaresData.length === 0) {
          setEventos([]);
          setMensaje('No tienes lugares registrados');
          setLoading(false);
          return;
        }
        
        // Cargar eventos para todos los lugares en paralelo
        const eventosPromises = lugaresData.map(lugar => 
          api.get(`/api/propietario/lugares/${lugar.id}/eventos-activos`)
            .then(res => ({
              ...lugar,
              eventos: Array.isArray(res.data?.eventos) ? res.data.eventos.map(evento => ({
                ...evento,
                portada: procesarImagenesPortada(evento.portada)
              })) : []
            }))
            .catch(error => {
              console.error(`Error cargando eventos para lugar ${lugar.id}:`, error);
              return {
                ...lugar,
                eventos: []
              };
            })
        );
        
        const lugaresConEventos = await Promise.all(eventosPromises);
        const todosLosEventos = lugaresConEventos.flatMap(lugar => 
          lugar.eventos.map(evento => ({
            ...evento,
            lugarNombre: lugar.nombre
          }))
        );
        
        console.log(`✅ Total de eventos encontrados: ${todosLosEventos.length}`);
        setEventos(todosLosEventos);
        setMensaje(todosLosEventos.length === 0 ? 'No se encontraron eventos para mostrar.' : '');
      } catch (error) {
        console.error('Error al cargar lugares:', error);
        const errorMessage = error.response?.data?.mensaje || 'Error al cargar los lugares. Intenta recargar la página.';
        setMensaje(errorMessage);
        setEventos([]);
      }
    } catch (error) {
      console.error('Error inesperado al cargar eventos:', error);
      setMensaje('Ocurrió un error inesperado. Por favor, recarga la página.');
      setEventos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarLugares = async () => {
    try {
      const response = await api.get('/api/propietario/lugares');
      const lugaresData = Array.isArray(response.data) ? response.data : [];
      setLugares(lugaresData);
      
      // Si hay un lugarId en la URL, verificar que exista en la lista de lugares
      if (lugarId) {
        const lugarSeleccionado = lugaresData.find(lugar => lugar.id === parseInt(lugarId, 10));
        if (lugarSeleccionado) {
          setNuevoEvento(prev => ({
            ...prev,
            lugarid: lugarSeleccionado.id
          }));
        } else {
          console.warn(`El lugar con ID ${lugarId} no fue encontrado en la lista de lugares del propietario`);
        }
      } 
      // Si no hay lugarId y hay lugares disponibles, seleccionar el primero por defecto
      else if (lugaresData.length > 0) {
        setNuevoEvento(prev => ({
          ...prev,
          lugarid: lugaresData[0].id
        }));
      }
      
      return lugaresData;
    } catch (error) {
      console.error('Error al cargar lugares:', error);
      const errorMessage = error.response?.data?.mensaje || error.message || 'Error desconocido';
      setMensaje('Error al cargar los lugares: ' + errorMessage);
      setLugares([]);
      return [];
    }
  };

  const cargarComentariosEvento = async (eventoId) => {
    try {
      const response = await api.get(`/api/evento/${eventoId}/comentarios`);
      setComentariosEvento(prev => ({ ...prev, [eventoId]: response.data.datos || [] }));
      setEventoComentariosAbierto(eventoId);
    } catch (error) {
      setMensaje('Error al cargar los comentarios: ' + (error.response?.data?.mensaje || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validar campos requeridos
      const camposRequeridos = {
        nombre: 'Nombre del evento',
        descripcion: 'Descripción',
        fecha_hora: 'Fecha y hora',
        lugarid: 'Lugar'
      };
      
      const camposFaltantes = Object.entries(camposRequeridos)
        .filter(([key]) => !nuevoEvento[key])
        .map(([_, label]) => label);
      
      if (camposFaltantes.length > 0) {
        toast.error(`Por favor completa los siguientes campos: ${camposFaltantes.join(', ')}`);
        return;
      }

      // Validar imágenes (1-3) solo para creación
      if (!eventoEditar && imagenesSeleccionadas.length === 0) {
        toast.error('Por favor selecciona al menos una imagen');
        return;
      }

      if (imagenesSeleccionadas.length > 3) {
        toast.error('Máximo se permiten 3 imágenes');
        return;
      }

      // Validar fecha futura
      const fechaEvento = new Date(nuevoEvento.fecha_hora);
      const ahora = new Date();
      ahora.setMinutes(ahora.getMinutes() - 5); // Margen de 5 minutos
      
      if (fechaEvento <= ahora) {
        toast.error('La fecha del evento debe ser futura');
        return;
      }

      setLoading(true);

      try {
        // Crear FormData
        const formData = new FormData();
        
        // Agregar campos del formulario
        formData.append('nombre', nuevoEvento.nombre.trim());
        formData.append('descripcion', nuevoEvento.descripcion.trim());
        formData.append('lugarid', nuevoEvento.lugarid);
        formData.append('capacidad', nuevoEvento.capacidad || '0');
        formData.append('precio', nuevoEvento.precio || '0');
        
        // Formatear fecha en formato ISO sin milisegundos
        const fechaISO = fechaEvento.toISOString().replace(/\.\d+/, '');
        formData.append('fecha_hora', fechaISO);
        
        console.log('Enviando datos:', {
          nombre: nuevoEvento.nombre.trim(),
          lugarid: nuevoEvento.lugarid,
          capacidad: nuevoEvento.capacidad || '0',
          precio: nuevoEvento.precio || '0',
          fecha_hora: fechaISO
        });
        
        // Agregar imágenes (el campo debe llamarse 'portada' según el backend)
        if (imagenesSeleccionadas.length > 0) {
          imagenesSeleccionadas.forEach((imagen, index) => {
            // Asegurarse de que sea un archivo válido
            if (imagen instanceof File) {
              formData.append('portada', imagen, imagen.name || `imagen-${index + 1}.jpg`);
            }
          });
        } else if (eventoEditar && nuevoEvento.portada) {
          // Si estamos editando y no hay imágenes nuevas, mantener las existentes
          const portadasExistentes = Array.isArray(nuevoEvento.portada) ? 
            nuevoEvento.portada : 
            JSON.parse(nuevoEvento.portada || '[]');
          
          portadasExistentes.forEach(url => {
            if (url) formData.append('portada', url);
          });
        }

        let response;
        
        // Determinar si es una actualización o creación
        if (eventoEditar) {
          console.log('Actualizando evento...');
          response = await api.put(`/api/evento/${eventoEditar.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        } else {
          console.log('Creando nuevo evento...');
          response = await api.post('/api/evento', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
        
        console.log('Respuesta del servidor:', response.data);
        
        // Verificar respuesta exitosa
        if (response.data && response.data.success !== false) {
          // Limpiar el formulario
          setNuevoEvento({
            nombre: '',
            lugarid: lugarId || '',
            capacidad: '',
            precio: '',
            descripcion: '',
            fecha_hora: ''
          });
          setImagenesSeleccionadas([]);
          setEventoEditar(null);
          
          // Cerrar el modal si está abierto
          const modal = document.getElementById('eventoModal');
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();
          }
          
          // Recargar la lista de eventos y lugares
          const [lugaresActualizados] = await Promise.all([
            cargarLugares(),
            cargarEventos()
          ]);
          
          // Mostrar mensaje de éxito
          toast.success(response.data.mensaje || (eventoEditar ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente'));
        } else {
          throw new Error(response.data?.error || (eventoEditar ? 'No se pudo actualizar el evento' : 'No se pudo crear el evento'));
        }
      } catch (error) {
        console.error('Error en la petición:', error);
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           error.message || 
                           (eventoEditar ? 'Error al actualizar el evento' : 'Error al crear el evento');
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         (eventoEditar ? 'Error al actualizar el evento' : 'Error al crear el evento');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (evento) => {
    setEventoEditar(evento);
    setNuevoEvento({
      nombre: evento.nombre,
      lugarid: evento.lugarid || (evento.lugar && evento.lugar.id) || '',
      capacidad: evento.capacidad,
      precio: evento.precio,
      descripcion: evento.descripcion,
      fecha_hora: evento.fecha_hora ? evento.fecha_hora.slice(0, 16) : '',
      portada: evento.portada || []
    });
    
    // Si el evento tiene imágenes, procesarlas para mostrarlas
    if (evento.portada) {
      const imagenesProcesadas = procesarImagenesPortada(evento.portada);
      setImagenesSeleccionadas(imagenesProcesadas);
    } else {
      setImagenesSeleccionadas([]);
    }
    
    // Desplazarse al formulario
    const formElement = document.getElementById('formularioEvento');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEliminar = async (eventoId) => {
    if (!window.confirm('¿Estás seguro de que deseas desactivar este evento? Esto lo ocultará de la vista pública.')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Usar la URL completa para la actualización
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/evento/${eventoId}`.replace(/([^:]\/)\/+/g, '$1');
      
      // Enviar una solicitud PUT para actualizar el estado del evento
      const response = await axios({
        method: 'put',
        url: apiUrl,
        data: { estado: false }, // Desactivar el evento
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        toast.success('Evento desactivado correctamente');
        // Recargar la lista de eventos
        await cargarEventos();
      } else {
        throw new Error(`Error inesperado: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al desactivar el evento:', error);
      let errorMessage = 'Error al desactivar el evento';
      
      if (error.response) {
        // El servidor respondió con un estado de error
        const responseData = error.response.data || {};
        errorMessage = responseData.mensaje || 
                     responseData.message || 
                     `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
      } else {
        // Algo sucedió en la configuración de la solicitud
        errorMessage = error.message || 'Error al realizar la petición';
      }
      
      toast.error(errorMessage);
    }
  };

  // Función para resaltar coincidencias en el nombre del evento
  const getNombreEventoResaltado = (nombre) => {
    const partes = busqueda
      ? nombre.split(new RegExp(`(${busqueda})`, 'gi'))
      : [nombre];
    return (
      <span>
        {partes.map((parte, idx) =>
          busqueda && parte.toLowerCase() === busqueda.toLowerCase()
            ? <span key={idx} className="resaltado-busqueda">{parte}</span>
            : <span key={idx}>{parte}</span>
        )}
      </span>
    );
  };

  // Obtener el nombre del lugar si se está filtrando por uno específico
  const lugarActual = lugarId && lugares.length > 0 ? 
    lugares.find(l => l.id === parseInt(lugarId)) : null;

  const eliminarImagen = (index) => {
    const nuevasImagenes = [...imagenesSeleccionadas];
    nuevasImagenes.splice(index, 1);
    setImagenesSeleccionadas(nuevasImagenes);
  };

  const handleImageChange = (e) => {
    try {
      const files = Array.from(e.target.files || []);
      
      // Validar que se hayan seleccionado archivos
      if (files.length === 0) {
        return;
      }
      
      // Validar cantidad de imágenes (máximo 3)
      if (imagenesSeleccionadas.length + files.length > 3) {
        toast.error('Solo puedes subir un máximo de 3 imágenes');
        return;
      }
      
      // Validar tipos de archivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const archivosValidos = files.filter(file => {
        const tipoValido = tiposPermitidos.includes(file.type.toLowerCase());
        if (!tipoValido) {
          console.warn(`Archivo no permitido: ${file.name} - Tipo: ${file.type}`);
          return false;
        }
        return true;
      });
      
      if (archivosValidos.length === 0) {
        toast.error('Solo se permiten imágenes en formato JPG, JPEG, PNG o WebP');
        return;
      }
      
      // Validar tamaño de archivo (máximo 5MB por imagen)
      const tamanoMaximo = 5 * 1024 * 1024; // 5MB
      const archivosDemasiadoGrandes = archivosValidos.some(file => file.size > tamanoMaximo);
      
      if (archivosDemasiadoGrandes) {
        toast.error('Cada imagen debe pesar menos de 5MB');
        return;
      }
      
      // Si todo está bien, agregar las imágenes válidas
      setImagenesSeleccionadas(prev => [...prev, ...archivosValidos]);
      
      // Limpiar el input para permitir seleccionar la misma imagen otra vez
      e.target.value = null;
    } catch (error) {
      console.error('Error al procesar las imágenes:', error);
      toast.error('Ocurrió un error al procesar las imágenes');
    }
  };

  const verImagen = (url) => {
    // URL de imagen por defecto (puedes reemplazarla con una imagen por defecto de tu elección)
    const IMAGEN_POR_DEFECTO = 'https://res.cloudinary.com/popaimagen/image/upload/v1620000000/placeholder.jpg';
    
    // Verificar si la URL es válida antes de mostrarla
    if (!url || typeof url !== 'string' || url.trim() === '') {
      toast.warning('No hay imagen disponible para este evento');
      setImagenModal({
        mostrar: true,
        url: IMAGEN_POR_DEFECTO
      });
      return;
    }
    
    // Asegurarse de que la URL sea absoluta
    let imageUrl = url;
    if (!url.startsWith('http') && !url.startsWith('data:')) {
      // Verificar si la URL ya tiene el prefijo de Cloudinary
      if (!url.includes('res.cloudinary.com')) {
        // Asegurarse de que la URL no tenga barras al inicio
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        imageUrl = `https://res.cloudinary.com/popaimagen/image/upload/${cleanUrl}`;
      } else {
        imageUrl = url;
      }
    }
    
    // Crear una imagen temporal para verificar si existe
    const img = new Image();
    
    // Establecer un tiempo de espera para la carga de la imagen
    const timeout = setTimeout(() => {
      if (!img.complete) {
        console.warn('Tiempo de espera agotado para cargar la imagen:', imageUrl);
        setImagenModal({
          mostrar: true,
          url: IMAGEN_POR_DEFECTO
        });
        toast.warning('La imagen está tardando demasiado en cargar');
      }
    }, 5000); // 5 segundos de tiempo de espera
    
    img.onload = () => {
      clearTimeout(timeout);
      // Verificar si la imagen se cargó correctamente (ancho y alto mayores a 0)
      if (img.width > 0 && img.height > 0) {
        setImagenModal({
          mostrar: true,
          url: imageUrl
        });
      } else {
        console.error('Imagen inválida (ancho o alto = 0):', imageUrl);
        setImagenModal({
          mostrar: true,
          url: IMAGEN_POR_DEFECTO
        });
      }
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      console.error('Error al cargar la imagen. URL:', imageUrl);
      // Mostrar imagen por defecto en lugar de solo mostrar un error
      setImagenModal({
        mostrar: true,
        url: IMAGEN_POR_DEFECTO
      });
      toast.warning('No se pudo cargar la imagen del evento');
    };
    
    // Iniciar la carga de la imagen
    img.src = imageUrl;
  };

  const cerrarModalImagen = () => {
    setImagenModal({
      mostrar: false,
      url: ''
    });
  };

  // Rest of the component's logic...

  return (
    <>
      <Sidebar lugarId={lugarId} />
      <div className="app-container">
        <div className="main-content">
          <h2>
            {lugarActual 
              ? `Eventos de ${lugarActual.nombre}` 
              : 'Mis Eventos'}
          </h2>
          {mensaje && <div className="mensaje">{mensaje}</div>}
          <form id="formularioEvento" onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <input
                type="text"
                value={nuevoEvento.nombre}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
                placeholder="Nombre del evento"
                required
              />
              <select
                value={nuevoEvento.lugarid}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, lugarid: e.target.value })}
                required
              >
                <option value="">Selecciona un lugar</option>
                {lugares.map((lugar) => (
                  <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                value={nuevoEvento.capacidad}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, capacidad: e.target.value })}
                placeholder="Capacidad"
                required
              />
              <input
                type="number"
                value={nuevoEvento.precio}
                onChange={(e) => setNuevoEvento({ ...nuevoEvento, precio: e.target.value })}
                placeholder="Precio"
                required
              />
            </div>
            <textarea
              value={nuevoEvento.descripcion}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
              placeholder="Descripción del evento"
              required
            />
            <input
              type="datetime-local"
              value={nuevoEvento.fecha_hora}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha_hora: e.target.value })}
              required
            />
            
            {/* Sección de carga de imágenes */}
            <div className="imagenes-portada">
              <label>Imágenes de portada (máx. 3):</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="input-imagen"
              />
              <div className="vista-previa">
                {imagenesSeleccionadas.map((imagen, index) => {
                  // Verificar si es un objeto File/Blob (nueva imagen) o una URL (imagen existente)
                  const src = imagen instanceof File || imagen instanceof Blob 
                    ? URL.createObjectURL(imagen)
                    : typeof imagen === 'string' && (imagen.startsWith('http') || imagen.startsWith('blob:') || imagen.startsWith('data:'))
                      ? imagen
                      : null;
                  
                  if (!src) {
                    console.warn('Tipo de imagen no soportado:', imagen);
                    return null;
                  }
                  
                  return (
                    <div key={index} className="imagen-contenedor">
                      <img 
                        src={src}
                        alt={`Portada ${index + 1}`}
                        className="imagen-miniatura"
                        onLoad={(e) => {
                          // Limpiar el objeto URL cuando la imagen se carga para evitar fugas de memoria
                          if (imagen instanceof File || imagen instanceof Blob) {
                            URL.revokeObjectURL(src);
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={() => eliminarImagen(index)}
                        className="btn-eliminar-imagen"
                        aria-label="Eliminar imagen"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Procesando...
                  </>
                ) : eventoEditar ? (
                  'Actualizar Evento'
                ) : (
                  'Crear Evento'
                )}
              </button>
              {eventoEditar && (
                <button 
                  type="button" 
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setEventoEditar(null);
                    setNuevoEvento({
                      nombre: '',
                      lugarid: lugarId || '',
                      capacidad: '',
                      precio: '',
                      descripcion: '',
                      fecha_hora: '',
                      portada: []
                    });
                    setImagenesSeleccionadas([]);
                  }}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>
          
          {/* Búsqueda mejorada */}
          <div className="busqueda-container">
            <div className="busqueda-input-container">
              <svg className="busqueda-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="busqueda-input"
                placeholder="Buscar eventos por nombre..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                aria-label="Buscar eventos"
              />
              {busqueda && (
                <button 
                  type="button" 
                  className="limpiar-busqueda"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            {busqueda && (
              <div className="resultados-busqueda">
                Mostrando {eventos.filter(e => e.nombre.toLowerCase().includes(busqueda.toLowerCase())).length} resultados
              </div>
            )}
          </div>
          {loading ? (
            <div className="cargando">Cargando eventos...</div>
          ) : (
            <div className="items-list">
              {eventos
                .filter(evento => {
                  // Filtro por nombre
                  if (busqueda && !evento.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
                  return true;
                })
                .length === 0 ? (
                <div className="sin-eventos">No hay eventos que coincidan con los filtros.</div>
              ) : (
                eventos
                  .filter(evento => {
                    if (busqueda && !evento.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false;
                    return true;
                  })
                  .map((evento) => {
                    // Obtener el nombre del lugar del evento o buscarlo en la lista de lugares
                    const obtenerNombreLugar = () => {
                      // Si el evento ya tiene lugar con nombre, usarlo
                      if (evento.lugar?.nombre) return evento.lugar.nombre;
                      
                      // Si solo tiene lugarid, buscarlo en la lista de lugares
                      if (evento.lugarid) {
                        const lugar = lugares.find(l => l.id === evento.lugarid || l.id === parseInt(evento.lugarid));
                        return lugar?.nombre || 'Lugar no encontrado';
                      }
                      
                      return 'No especificado';
                    };
                    
                    return (
                      <div key={evento.id} className={`item-card ${!evento.estado ? 'inactivo' : ''}`}>
                        <div className="item-header">
                          <strong>{getNombreEventoResaltado(evento.nombre)}</strong>
                          <span>{new Date(evento.fecha_hora).toLocaleString()}</span>
                        </div>
                      <div className="item-content">
                        {/* Mostrar imágenes de portada si existen */}
                        {(() => {
                          try {
                            const imagenes = procesarImagenesPortada(evento.portada);
                            if (!imagenes || imagenes.length === 0) return null;
                            
                            // Filtrar URLs vacías o inválidas
                            const imagenesValidas = imagenes.filter(url => url && typeof url === 'string' && url.trim() !== '');
                            if (imagenesValidas.length === 0) return null;
                            
                            return (
                              <div className="portada-preview">
                                <div className="portada-grid">
                                  {imagenesValidas.slice(0, 3).map((imagen, idx) => (
                                    <div 
                                      key={idx} 
                                      className="portada-item" 
                                      onClick={() => verImagen(imagen)}
                                    >
                                      <img 
                                        src={imagen} 
                                        alt={`Portada ${idx + 1}`} 
                                        className="portada-imagen"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = defaultImage;
                                          e.target.style.objectFit = 'contain';
                                          e.target.style.padding = '8px';
                                        }}
                                      />
                                      {imagenesValidas.length > 3 && idx === 2 && (
                                        <div className="mas-imagenes">+{imagenesValidas.length - 3}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          } catch (error) {
                            console.error('Error al mostrar las imágenes:', error);
                            return null;
                          }
                        })()}
                        <p>{evento.descripcion}</p>
                        <div className="item-details">
                          <span>Fecha: {new Date(evento.fecha_hora).toLocaleString()}</span>
                          <span>Estado: 
                            <span className={`estado-badge ${evento.estado ? 'activo' : 'inactivo'}`}>
                              {evento.estado ? 'Activo' : 'Inactivo'}
                            </span>
                          </span>
                        </div>
                      </div>
                        <div className="item-footer">
                          <button onClick={() => handleEditar(evento)} className="btn-editar">Editar</button>
                          <button onClick={() => handleEliminar(evento.id)} className="btn-eliminar">Eliminar</button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver imagen en tamaño completo */}
      {imagenModal.mostrar && (
        <div className="modal-imagen" onClick={cerrarModalImagen}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarModalImagen}>&times;</button>
            <img src={imagenModal.url} alt="Vista previa" className="imagen-completa" />
          </div>
        </div>
      )}
    </>
  );
};

export default Eventos;
