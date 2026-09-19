import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  server: {
    host: true,
    port: 8080,
  },
  plugins: [react()],
  ssr: { noExternal: ["react-helmet-async"] },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    copyPublicDir: !isSsrBuild,
    rollupOptions: isSsrBuild ? {} : {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["framer-motion", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
