// --- DEMO utilisation EventEmitter
import { EventEmitter } from "node:events";

// 1. Instancier EventEmitter et le stocker
const bus = new EventEmitter();

// 2. abonnement à un évent (=souscrire)
bus.on("connexion", (utilisateur) => {
  // je définis le mot
  console.log(`${utilisateur} s'est connecté`);
});

// 3. si nécessaire - Ecouter une seule fois (pour initialiser pour une première connexion)
bus.once("connexion", () => {
  console.log("Premier message reçu !");
});

// 4. Emettre un événement = déclencher l'événement
bus.emit("connexion", "Christophe Germain");
bus.emit("connexion", "Xavier Vigneron");
bus.emit("connexion", "Garance Guinet");
