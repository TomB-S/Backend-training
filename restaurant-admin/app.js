// Importation du framework Express
import express from "express";

// Création de l'instance de l'application Express
// c'est l'objet central sur lequel brancher le reste de l'app
const app = express();

// Middleware : parse automatiquement le corps des requêtes JSON
// permet à Express de lire le corps des requêtes JSON
app.use(express.json());

// Route GET "/" — renvoie un message de bienvenue
app.get("/", (req, res) => {
  res.send("Bonjour !");
});

// Démarrage du serveur sur le port défini dans .env ou 3000 par défaut
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
