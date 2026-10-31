/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  preview: { port: 4173 },
  build: {
    // Cloudflare Workers serves this directory (see wrangler.jsonc).
    outDir: "build",
  },
  test: {
    include: ["src/**/*.test.ts", "worker/**/*.test.ts"],
    environment: "node",
  },
});
