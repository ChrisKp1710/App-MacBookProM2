const fs = require("fs");
const path = require("path");

// Percorso della directory dist
const distPath = path.resolve(__dirname, "../dist");

// Percorso per il file package.json nella directory dist
const outputPath = path.join(distPath, "package.json");

// Percorso per il file yarn.lock nella directory dist
const yarnLockPath = path.join(distPath, "yarn.lock");

// Legge il package.json principale
const mainPackageJson = require("../package.json");

// Crea una versione minimale del package.json con i campi richiesti
const minimalPackageJson = {
  name: mainPackageJson.name, // Nome dell'app
  version: mainPackageJson.version || "1.0.0", // Usa una versione di default se non specificata
  main: "main.js", // Punto di ingresso del processo principale di Electron
  description: mainPackageJson.description || "An Electron app", // Descrizione generica se non specificata
  author: "Christian Koscielniak Pinto", // Autore
  license: mainPackageJson.license || "MIT", // Licenza, usa MIT come default
};

// Scrive il file package.json minimale nella directory dist
fs.writeFileSync(outputPath, JSON.stringify(minimalPackageJson, null, 2));
console.log("Minimal package.json copied to dist directory.");

// Crea un file yarn.lock vuoto in dist se non esiste
if (!fs.existsSync(yarnLockPath)) {
  fs.writeFileSync(yarnLockPath, "");
  console.log(
    "File yarn.lock vuoto creato automaticamente nella directory dist."
  );
} else {
  console.log("Il file yarn.lock esiste già nella directory dist.");
}
