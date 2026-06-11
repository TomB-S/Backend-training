// routes/dish.js - Toutes les routes CRUD des plats
import { Router } from "express";
// Import du modèle pour accéder à MySQL
import { DishModel } from "../models/dish.model.js";

// Création de l'instance du routeur
const router = Router();

// GET /plats/lister — Afficher tous les plats
router.get("/lister", async (req, res, next) => {
  try {
    // Récupère tous les plats depuis MySQL
    const plats = await DishModel.findAll();
    // Passe le tableau plats à la vue index.pug
    res.render("index", { plats });
  } catch (err) {
    next(err);
  }
});

// GET /plats/creer — Afficher le formulaire de création vide
router.get("/creer", (req, res) => {
  res.render("create");
});

// POST /plats/creer — Traiter la soumission du formulaire de création
router.post("/creer", async (req, res, next) => {
  try {
    // Récupère les données du formulaire depuis req.body
    const { name, price } = req.body;
    await DishModel.create(name, price);
    // Redirige vers la liste après création (pattern PRG)
    res.redirect("/plats/lister");
  } catch (err) {
    next(err);
  }
});

// GET /plats/editer?id=X — Afficher le formulaire d'édition pré-rempli
router.get("/editer", async (req, res, next) => {
  try {
    // Récupère l'id depuis l'URL (?id=X)
    const plat = await DishModel.findById(req.query.id);
    // Si le plat n'existe pas, retourne une erreur 404
    if (!plat) return res.status(404).send("Plat non trouvé");
    // Passe le plat à la vue edit.pug pour pré-remplir le formulaire
    res.render("edit", { plat });
  } catch (err) {
    next(err);
  }
});

// POST /plats/editer — Traiter la soumission du formulaire d'édition
router.post("/editer", async (req, res, next) => {
  try {
    // Récupère id, name et price depuis le formulaire
    const { id, name, price } = req.body;
    await DishModel.update(id, name, price);
    // Redirige vers la liste après modification
    res.redirect("/plats/lister");
  } catch (err) {
    next(err);
  }
});

// GET /plats/supprimer?id=X — Supprimer un plat et rediriger
router.get("/supprimer", async (req, res, next) => {
  try {
    // Récupère l'id depuis l'URL (?id=X)
    await DishModel.delete(req.query.id);
    // Redirige vers la liste après suppression
    res.redirect("/plats/lister");
  } catch (err) {
    next(err);
  }
});

// Export du routeur pour l'utiliser dans app.js
export default router;
