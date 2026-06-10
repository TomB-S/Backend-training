// Coeur du projet — crée et démarre le serveur HTTP
// Reçoit chaque requête et la délègue au routeur

import http from "http"; // module natif Node.js pour créer un serveur HTTP
import { dispatch } from "./router/index.js"; // importe uniquement la fonction dispatch du routeur

class Server {
  constructor(config) {
    this.config = config; // stocke la config dans l'instance pour y accéder partout dans la classe

    // http.createServer() crée le serveur et lui passe un callback exécuté à chaque requête
    // req = http.IncomingMessage : URL, méthode, headers, body (stream)
    // res = http.ServerResponse : permet d'envoyer statut, headers et corps de la réponse
    this.httpServer = http.createServer((req, res) => {
      dispatch(req, res); // délègue chaque requête au routeur qui choisit le bon handler
    });
  }

  start() {
    // lance l'écoute sur le port et l'host définis dans la config
    this.httpServer.listen(this.config.port, this.config.host, () => {
      console.log(`Serveur démarré en mode [${this.config.env}]`);
      console.log(`→ http://localhost:${this.config.port}`);
    });

    // SIGINT = signal envoyé par Ctrl+C
    // httpServer.close() attend que les connexions actives se terminent avant de quitter
    process.on("SIGINT", () => {
      this.httpServer.close(() => {
        console.log("Serveur arrêté proprement.");
        process.exit(0); // quitte le processus avec le code 0 (= succès)
      });
    });

    // SIGTERM = signal envoyé par Docker stop ou PM2 — même comportement que SIGINT
    process.on("SIGTERM", () => {
      this.httpServer.close(() => process.exit(0));
    });
  }
}

export default Server; // export default = exporte la classe pour index.js
