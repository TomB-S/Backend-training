// src/quiz.service.js
// Couche SERVICE : gère les appels HTTP vers qr-data
// RÈGLE : pas de console.log ici — on retourne des données, c'est tout

// URL de base de l'API qr-data
// process.env.QR_DATA_URL permet de changer l'URL via une variable d'environnement
// Si elle n'est pas définie, on utilise localhost:3001 par défaut
const BASE_URL = process.env.QR_DATA_URL || "http://localhost:3001";

/**
 * Récupère N questions aléatoires depuis qr-data.
 * fetch est disponible nativement depuis Node.js 18 — pas besoin d'installer node-fetch.
 * @param {number} nombre - Nombre de questions à récupérer (défaut : 5)
 * @returns {Promise<Array<{id, question, reponse}>>} - Tableau de questions aléatoires
 */
export async function recupererQuestionsAleatoires(nombre = 5) {
  // fetch() envoie une requête HTTP GET vers l'API
  const response = await fetch(`${BASE_URL}/questions-reponses`);

  // Si le serveur répond avec une erreur (404, 500...), on lance une exception
  if (!response.ok) throw new Error(`Erreur API : ${response.status}`);

  // .json() parse le corps de la réponse en objet JavaScript
  const data = await response.json();

  // json-server retourne un tableau directement — on s'adapte aux deux formats possibles
  // data['questions-reponses'] existe si le JSON a cette clé, sinon on prend data directement
  const toutes = data["questions-reponses"] ?? data;

  // [...toutes] crée une copie du tableau pour ne pas modifier l'original
  // .sort(() => Math.random() - 0.5) mélange aléatoirement les éléments
  // .slice(0, nombre) garde uniquement les N premiers éléments
  return [...toutes].sort(() => Math.random() - 0.5).slice(0, nombre);
}
