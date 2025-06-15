import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');
  
  // Configuración de la URL de la API
  const apiUrl = env.VITE_API_URL || 'https://popnocturna.vercel.app';
  const isDev = mode === 'development';

  // Configuración del proxy solo para desarrollo
  const proxyConfig = isDev ? {
    '/api': {
      target: apiUrl,
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ''),
      configure: (proxy) => {
        proxy.on('error', (err) => {
          console.error('Proxy error:', err);
        });
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('Origin', 'http://localhost:3000');
        });
        proxy.on('proxyRes', (proxyRes) => {
          proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
          proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'X-Requested-With, content-type, Authorization';
        });
      }
    }
  } : undefined;

  return {
    plugins: [react()],
    base: '/',
    server: {
      port: 3000,
      open: true,
      strictPort: true,
      proxy: proxyConfig,
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(isDev ? '' : apiUrl)
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'react-toastify', 'react-icons'],
          },
        },
      },
    },
  };
});
