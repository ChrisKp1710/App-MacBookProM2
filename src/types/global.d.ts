// Dichiarazione del modulo @rollup/plugin-commonjs
declare module "@rollup/plugin-commonjs" {
  import type { Plugin } from "rollup";

  interface CommonJSOptions {
    dynamicRequireTargets?: string | string[];
    // ... altre opzioni se necessarie
  }

  function commonjs(options?: CommonJSOptions): Plugin;
  export default commonjs;
}

// Definizione dell'interfaccia ElectronAPI
export interface ElectronAPI {
  salvaAppunto: (data: {
    titolo: string;
    contenuto: string;
  }) => Promise<{ success: boolean; id: string }>;
}

// Estensione dell'oggetto Window globale
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
