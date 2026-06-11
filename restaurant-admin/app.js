// app.js - Point d'entrée de l'application Express

// Charge les variables du fichier .env dans process.env
import "dotenv/config";
import express from "express";

// join et dirname permettent de construire des chemins absolus vers les dossiers
import { join, dirname } from "node:path";
// fileURLToPath convertit l'URL du module en chemin de fichier
import { fileURLToPath } from "node:url";

// Import des routeurs
import indexRouter from "./routes/index.js";
import dishRouter from "./routes/dish.js";

// __dirname n'existe pas en ESM - on le recrée manuellement
const __dirname = dirname(fileURLToPath(import.meta.url));

// Création de l'instance Express
const app = express();

// ─── Moteur de vues ────────────────────────────────────────────
// Indique à Express où trouver les fichiers Pug
app.set("views", join(__dirname, "views"));
// Définit Pug comme moteur de template
app.set("view engine", "pug");

// ─── Middlewares globaux ───────────────────────────────────────
// Parse le corps des requêtes JSON
app.use(express.json());
// Parse les formulaires HTML (nécessaire pour req.body dans les POST)
app.use(express.urlencoded({ extended: true }));
// Sert les fichiers statiques du dossier public (images, css...)
app.use(express.static(join(__dirname, "public")));

// ─── Routes ───────────────────────────────────────────────────
// Route principale - gère "/"
app.use("/", indexRouter);
// Routes des plats - gère tout ce qui commence par "/plats"
app.use("/plats", dishRouter);

// ─── Middleware d'erreur - TOUJOURS EN DERNIER ─────────────────
// 4 paramètres = signature obligatoire du middleware d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(
    // En production on cache les détails de l'erreur
    process.env.NODE_ENV === "production"
      ? "Erreur interne du serveur"
      : `<pre>${err.message}\n${err.stack}</pre>`,
  );
});

// ─── Démarrage du serveur ──────────────────────────────────────
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Restaurant Admin démarré : http://localhost:${PORT}`);
});
