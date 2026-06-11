// Définit les routes des villes (CRUD complet)

import express from "express";

export const router = express.Router();

// Compteur pour générer des IDs uniques
let compteurID = 3;

// Tableau en mémoire simulant une base de données
let villes = [
  { id: 1, nom: "Paris" },
  { id: 2, nom: "Lyon" },
];

// GET /villes — retourne toutes les villes
router.get("/", (req, res) => {
  res.json(villes);
});

// GET /villes/:id — retourne une ville par son ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id); // récupère l'ID depuis l'URL
  const ville = villes.find((v) => v.id === id); // cherche la ville dans le tableau
  res.json(ville);
});

// POST /villes — crée une nouvelle ville
router.post("/", (req, res) => {
  const name = req.body.nom; // récupère le nom depuis le corps de la requête
  const newCity = { id: compteurID, nom: name }; // crée l'objet ville
  compteurID++; // incrémente le compteur pour le prochain ID
  villes.push(newCity); // ajoute la ville au tableau
  res.status(201).json(newCity); // 201 = Created
});

// PUT /villes/:id — modifie une ville existante
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id); // récupère l'ID depuis l'URL
  const name = req.body.nom; // récupère le nouveau nom depuis le body
  const ville = villes.find((v) => v.id === id); // trouve la ville à modifier
  ville.nom = name; // met à jour le nom
  res.status(200).json(ville); // retourne la ville modifiée
});

// DELETE /villes/:id — supprime une ville
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id); // récupère l'ID depuis l'URL
  villes = villes.filter((v) => v.id !== id); // garde toutes les villes sauf celle à supprimer
  res.status(204).send(); // 204 = No Content (suppression réussie, pas de body)
});
