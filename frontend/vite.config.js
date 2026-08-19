import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {

    host: true, // 👈 this exposes the server to your local network

    port: 5173, // optional: change if you want,

    // TODO: Remove the watch and server from here

    watch: {
      usePolling: true,
    },

  },
})  
