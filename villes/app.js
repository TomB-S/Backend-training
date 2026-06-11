// ASSEMBLE & LANCE L'APPLI

// 1. Imports
import express from "express";
import { router } from "./ville.js"; // on importe le router défini dans ville.js

// 2. Créer l'app
const app = express();

// 3. Middlewares globaux
app.use(express.json()); // permet de lire le corps JSON des requêtes

// 4. Monter les routes
// toutes les requêtes vers /villes sont gérées par le router de ville.js
app.use("/villes", router);

// 5. Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Application démarrée sur http://localhost:${PORT}`);
});
