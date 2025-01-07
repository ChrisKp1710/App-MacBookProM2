import { defineConfig } from "vite";
import { resolve } from "path";
import renderer from "vite-plugin-electron-renderer";
import electron from "vite-plugin-electron";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        renderer: resolve(__dirname, "src/index.html"),
        main: resolve(__dirname, "src/main.ts"),
        preload: resolve(__dirname, "src/preload.ts"),
        
      },
      output: {
        entryFileNames: "[name].js",
        format: "cjs", // Usa CommonJS per compatibilità con Electron
        dir: "./dist",
      },
      external: ["better-sqlite3"], // Escludi better-sqlite3 dalla build
    },
  },
  plugins: [
    electron({
      entry: resolve(__dirname, "src/main.ts"),
      vite: {
        build: {
          outDir: "../dist",
          emptyOutDir: false,
          rollupOptions: {
            external: ["better-sqlite3"], // Escludi better-sqlite3
          },
        },
      },
      onstart: (options) => {
        options.startup();
      },
    }),
    renderer(),
  ],
  // Aggiungi questa sezione per assicurarti che il modulo nativo venga incluso nella build
  optimizeDeps: {
    exclude: ["better-sqlite3"], // Evita di includere better-sqlite3 nella build di Vite
  },
});
