import { contextBridge, ipcRenderer } from "electron";

// Espone l'API electronAPI al processo di rendering
contextBridge.exposeInMainWorld("electronAPI", {
  salvaAppunto: (data: { titolo: string; contenuto: string }) =>
    ipcRenderer.invoke("salva-appunto", data),
});
