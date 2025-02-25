import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['gaia-com.onrender.com']
  },
  server: {
    host: true, // Allows external access
    port: 5173
  }
});
