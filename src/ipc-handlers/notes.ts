import { ipcMain } from "electron";
import { databaseService } from "../services/database";

// Salvare un appunto
ipcMain.handle("salva-appunto", async (event, { titolo, contenuto }) => {
  const id = databaseService.salvaAppunto(titolo, contenuto);
  return { success: true, id };
});

// Recuperare tutti gli appunti
ipcMain.handle("recupera-appunti", async () => {
  return databaseService.recuperaAppunti();
});

// Eliminare un appunto
ipcMain.handle("elimina-appunto", async (event, id) => {
  databaseService.eliminaAppunto(id);
  return { success: true };
});
