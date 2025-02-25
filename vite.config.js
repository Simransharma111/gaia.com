import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Ensure it binds to all network interfaces
    port: 5173,  // Default Vite port, but Render will override this
  },
});
