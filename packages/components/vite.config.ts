import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ include: "src", insertTypesEntry: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        game: path.resolve(__dirname, "src/game/index.ts"),
        "tailwind-base": path.resolve(__dirname, "src/tailwind-base.ts"),
      },
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-hook-form",
        "zod",
        "lucide-react",
        "@rivet-gg/api",
      ],
    },
  },
});
