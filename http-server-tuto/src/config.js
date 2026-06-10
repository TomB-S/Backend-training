// Configuration centralisée du serveur
// En ESM : import.meta.url remplace __dirname qui n'existe plus

import { fileURLToPath } from "url"; // convertit l'URL du fichier en chemin absolu
import { dirname, join } from "path"; // dirname = dossier parent, join = construit un chemin

// Recrée __dirname en ESM
// import.meta.url = 'file:///home/user/projet/src/config.js'
// fileURLToPath() → '/home/user/projet/src/config.js'
// dirname() → '/home/user/projet/src'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  // process.env.PORT permet de surcharger le port au lancement : PORT=8080 node index.js
  // parseInt(..., 10) force la conversion en entier base 10
  port: parseInt(process.env.PORT || "3000", 10),

  // 0.0.0.0 = écoute sur toutes les interfaces réseau (localhost + réseau local)
  host: process.env.HOST || "0.0.0.0",

  // Permet de distinguer 'development' / 'production' pour adapter les logs
  env: process.env.NODE_ENV || "development",

  // join(__dirname, '..', 'public') remonte d'un niveau depuis src/ → pointe sur /public
  publicDir: join(__dirname, "..", "public"),
};

export default config; // export default = un seul export principal par fichier
