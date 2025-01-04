import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.NODE_ENV === "development";
const devServerURL = "http://localhost:5175"; // Assicurati di usare la porta corretta

const createMainWindow = () => {
  if (mainWindow) return; // Previeni la creazione di più finestre

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    console.log("Caricamento URL in modalità sviluppo:", devServerURL); // Debug
    mainWindow.loadURL(devServerURL).catch((err) => {
      console.error("Errore nel caricamento del Dev Server di Vite:", err);
    });

    // Apri DevTools in modalità sviluppo
    mainWindow.webContents.openDevTools();
  } else {
    console.log("Caricamento file HTML in modalità produzione..."); // Debug
    mainWindow.loadFile(path.join(__dirname, "index.html")).catch((err) => {
      console.error("Errore nel caricamento del file HTML:", err);
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!mainWindow) {
    createMainWindow();
  }
});
