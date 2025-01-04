import { app, BrowserWindow } from "electron";

let mainWindow: BrowserWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("index.html"); // Percorso relativo a `dist`
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
