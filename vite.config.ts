import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    "/api": {
      target: "http://10.0.109.121:3000",
      changeOrigin: true,
    },
  },
},

});
