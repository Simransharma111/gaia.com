export default defineConfig({
  server: {
    host: true, // This makes the app accessible externally
    port: 5173,
    strictPort: true,
    preview: {
      allowedHosts: ["https://gaia-com.onrender.com/"] // Add your Render domain here
    }
  }
});
