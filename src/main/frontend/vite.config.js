import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    proxy: {
      '/api': {
        target: "http://localhost:8093",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
      }
    },
    historyApiFallback: true,
  },
  define: {
    global: 'window',
  },
  optimizeDeps: {
    include: ['process'],
  },
})
