import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": {
        // Proxy a la API
        target: "https://api.abcallg03.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v1/, "/v1"), // Reescribe la ruta si es necesario
        secure: true, // Si el servidor tiene HTTPS sin un certificado válido (en dev)
      },
    },
  },
});
