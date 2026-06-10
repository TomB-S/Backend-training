// Point d'entrée — démarre le serveur
// En ESM : import au lieu de require(), extension .js obligatoire

import config from "./src/config.js"; // importe l'objet de configuration (port, host, publicDir...)
import Server from "./src/server.js"; // importe la classe Server

const server = new Server(config); // crée une instance du serveur en lui passant la config
server.start(); // démarre le serveur (écoute sur le port défini dans config)
