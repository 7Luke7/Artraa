import "dotenv/config"
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: [
        "dale-nonoxidizing-cordelia.ngrok-free.dev",
        ".ngrok-free.dev",
        "localhost"
      ]
    }
  },
  server: {
    port: 3000,
    experimental: {
      websocket: true,
    },
  }
}).addRouter({
  name: "ws",
  type: "http",
  target: "server",
  base: "/ws",
  handler: "./src/server/ws.js"
});