import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },

    }),
  ],
  server: {
    https: false,
    host: "0.0.0.0",
    port: 3335,
    hmr: {
      clientPort: 443, // Important: HMR through Nginx on HTTPS
      host: "waw.com.tn",
    },
    cors: true,
    allowedHosts: ["waw.com.tn", "localhost", "172.17.0.11", "102.211.209.131"],
    proxy: {
      "/api": {
        target: "http://172.17.0.10:8080",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://172.17.0.10:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  // Add base configuration for production
  base: '/',
});