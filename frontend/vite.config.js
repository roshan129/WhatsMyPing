import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: process.env.VITE_API_BASE_URL
      ? undefined
      : {
          '/api': {
            target: 'http://localhost:4001',
            changeOrigin: true,
          },
          '/health': {
            target: 'http://localhost:4001',
            changeOrigin: true,
          },
        },
  },
})
