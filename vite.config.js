import { defineConfig } from 'vite'; // ✅ Import defineConfig
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // ✅ Allows external access
    port: 5173,
    strictPort: true,
    preview: {
      allowedHosts: ["gaia-com.onrender.com"] // ✅ Add your Render domain
    }
  }
});
