import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  base: "/",
  plugins: [react(), eslint()],
  server: {
    open: false,
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
});
