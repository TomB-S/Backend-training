// utilisation server HTTP natif
// en tulisant éléments du serveur + ses objets (req et res)
import http from "node:http";

//? 1. Déclarer et instancier (readonly par le biais de const)
const serveur = http.createServer();

function getUrl(req) {
  // Gérer mon URL : req.url
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log("Chemin    :", url.pathname);
  console.log("Paramètre :", url.searchParams.get("Page"));
  console.log("Méthode   :", req.method);
  console.log("En-tête   :", req.headers["accept"]);
}

//? 2. Êcrire comportement du serveur pour le déclencher à la connexion
// req = Incoming message: requete du client
// res = Server Response: la réponse à envoyer
serveur.on("request", (req, res) => {
  // --- gérer l'url---
  getUrl(req);
  // --- les en-têtes HTTP ---
  res.writeHead(200, {
    // analogie de l'enveloppe
    "Content-Type": "text/plain; charset=utf-8",
  });
  // --- le corps de la réponse et ferme la connexion ---
  res.end("Bonjour depuis Node.js !"); // analogie de le lettre + on ferme l'enveloppe
});

//? 3. Configurer le port d'écoute
// si le port n'est pas crée, il est sur le 3000
const PORT = process.env.PORT || 3000;
// écouter le port en continue pour répondre aux clients web (listen)
// + afficher le message
serveur.listen(PORT, () => {
  console.log(`Serveur demarre sur http://localhost:${PORT}`);
});

// ===============
// Pattern : Singleton en Objet Litéral
