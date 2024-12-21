import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  base: "/",
  plugins: [react(), viteTsconfigPaths(), eslint()],
  server: {
    open: false,
    port: 3000,
  },
  esbuild: {
    target: "esnext",
    platform: "browser",
  },
});
