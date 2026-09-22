import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["organised-resulting-sit-preceding.trycloudflare.com"],
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
