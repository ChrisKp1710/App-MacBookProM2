import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

class DatabaseService {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath("userData"), "appunti.db");
    this.db = new Database(dbPath);

    // Creazione della tabella
    this.db
      .prepare(
        `
      CREATE TABLE IF NOT EXISTS appunti (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_universale TEXT UNIQUE,
        titolo TEXT NOT NULL,
        contenuto TEXT,
        data_creazione DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_modifica DATETIME DEFAULT CURRENT_TIMESTAMP,
        sincronizzato INTEGER DEFAULT 0
      )
    `
      )
      .run();
  }

  salvaAppunto(titolo: string, contenuto: string): string {
    const idUniversale = crypto.randomUUID();
    this.db
      .prepare(
        "INSERT INTO appunti (id_universale, titolo, contenuto) VALUES (?, ?, ?)"
      )
      .run(idUniversale, titolo, contenuto);
    return idUniversale;
  }

  recuperaAppunti() {
    return this.db
      .prepare("SELECT * FROM appunti ORDER BY data_creazione DESC")
      .all();
  }

  eliminaAppunto(id: number) {
    this.db.prepare("DELETE FROM appunti WHERE id = ?").run(id);
  }
}

export const databaseService = new DatabaseService();
