import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig(({ command, mode }) => {
  const env = {};
  if (mode === "production") {
    env["process.env.NODE_ENV"] = '"production"';
  }
  console.log("running in mode", mode);
  return {
    plugins: [react(), svgrPlugin({ svgrOptions: { icon: true } })],
    define: env,
    build: {
      minify: true,
      lib: {
        name: "scan",
        entry: {
          scan: resolve(__dirname, "src/main.tsx"),
        },
        fileName: (format) => {
          console.log("format me", format);
          return "index.js";
        },
        formats: ["esm"],
      },
    },
    server: {
      hmr: {
        host: "localhost",
      },
      port: 3000,
    },
    test: {},
  };
});
