import { app, BrowserWindow } from "electron";
import path from "path";
import { readFileSync, existsSync } from "fs";
import "./ipc-handlers/notes";
import { join } from "path";

const betterSqlite3Path =
  process.env.NODE_ENV === "development"
    ? join(
        __dirname,
        "node_modules",
        "better-sqlite3",
        "build",
        "Release",
        "better_sqlite3.node"
      )
    : join(
        process.resourcesPath,
        "app.asar.unpacked",
        "node_modules",
        "better-sqlite3",
        "build",
        "Release",
        "better_sqlite3.node"
      );

const Database = require(betterSqlite3Path);
console.log("Better-sqlite3 loaded successfully:", Database);

let mainWindow: BrowserWindow | null = null;
const isDev = process.env.NODE_ENV === "development";

const getDevServerURL = () => {
  if (isDev) {
    const devServerPath = path.join(__dirname, "../dist/.vite_dev_server.json");
    if (existsSync(devServerPath)) {
      try {
        const devServerInfo = JSON.parse(readFileSync(devServerPath, "utf-8"));
        return `http://localhost:${devServerInfo.port}`;
      } catch (error) {
        console.error("Errore nel parsing di .vite_dev_server.json:", error);
      }
    }
  }
  return "http://localhost:5174"; // Porta predefinita
};

const createMainWindow = () => {
  if (mainWindow) return;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    const devServerURL = getDevServerURL();
    console.log("Caricamento URL in modalità sviluppo:", devServerURL);
    mainWindow.loadURL(devServerURL).catch((err) => {
      console.error("Errore nel caricamento del Dev Server di Vite:", err);
    });

    mainWindow.webContents.openDevTools();
  } else {
    console.log("Caricamento file HTML in modalità produzione...");
    mainWindow.loadFile(path.join(__dirname, "index.html")).catch((err) => {
      console.error("Errore nel caricamento del file HTML:", err);
    });

    mainWindow.removeMenu();
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
