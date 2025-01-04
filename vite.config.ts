import { defineConfig } from "vite";
import { resolve } from "path";
import renderer from "vite-plugin-electron-renderer";
import electron from "vite-plugin-electron";

export default defineConfig({
  root: "./src", // Directory sorgente del progetto
  build: {
    outDir: "../dist", // Tutti i file di output nella stessa cartella
    emptyOutDir: true, // Pulisce la directory dist prima della build
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"), // Entry point del renderer (HTML)
      },
    },
  },
  plugins: [
    electron({
      entry: resolve(__dirname, "src/main.ts"), // Processo principale
      vite: {
        build: {
          outDir: "../dist", // Imposta la stessa directory dist
          emptyOutDir: false, // Disabilita la pulizia, gestita sopra
        },
      },
    }),
    renderer(), // Configura il renderer
  ],
});
