import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // <- esto ayuda a que las rutas no se rompan al servir estáticamente
});