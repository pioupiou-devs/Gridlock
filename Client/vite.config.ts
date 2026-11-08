import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const backendUrl = process.env.VITE_BACKEND_URL ?? 'http://localhost:5281'

export default defineConfig({
  base: '/Gridlock/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/gridhub': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
