// routes/index.js - Route principale de l'application
// On importe Router depuis Express pour créer un routeur modulaire
import { Router } from "express";

// Création de l'instance du routeur
const router = Router();

// Route GET "/" - redirige automatiquement vers la liste des plats
router.get("/", (req, res) => {
  res.redirect("/plats/lister");
});

// Export du routeur pour l'utiliser dans app.js
export default router;
