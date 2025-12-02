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
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
