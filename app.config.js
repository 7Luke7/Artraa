import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      solidPlugin({
        ssr: true,
      }),
    ],
  },
  server: {
    port: 3000,
    allowedHosts: ["dale-nonoxidizing-cordelia.ngrok-free.dev"],
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