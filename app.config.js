import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  vite: {
    plugins: [tailwindcss(), solidPlugin({
      ssr: true
    })]
  },
  server: {
    allowedHosts: ['dale-nonoxidizing-cordelia.ngrok-free.dev'],
    port: 3000,
    experimental: {
      websocket: true,
    }
  },
  build: {
    target: 'esnext',
  },
}).addRouter({
  name: "ws",
  type: "http",
  handler: "./src/server/ws.js",
  target: "server",
  base: "/ws",
});