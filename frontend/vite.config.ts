import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import eslint from "vite-plugin-eslint";
import { VitePluginRadar } from "vite-plugin-radar";

export default defineConfig({
  base: "",
  plugins: [
    react(),
    viteTsconfigPaths(),
    eslint(),
    VitePluginRadar({
      analytics: {
        id: "G-N2BPB5VE3D",
      },
    }),
  ],
  server: {
    open: false,
    port: 3000,
  },
  esbuild: {
    target: "esnext",
    platform: "browser",
  },
});
