import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), envCompatible()],
  server: {
    host: '0.0.0.0', // Esto permite que Vite escuche en todas las interfaces de red
    port: 5173,
  }
})
