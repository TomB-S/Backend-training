// ============================================================
// src/utils/logger.js — Journalisation (ESM)
// ============================================================
// ESM : exports nommés — le consommateur fait :
//   import * as logger from './logger.js'  → logger.info(…)
// ou :
//   import { info, error } from './logger.js'
// ============================================================

// timestamp : retourne l'heure courante au format lisible français
// toLocaleTimeString avec fractionalSecondDigits = inclut les millisecondes
function timestamp() {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

// info : événements normaux (démarrage serveur, routes appelées...)
export function info(message) {
  console.log(`[${timestamp()}] INFO  ${message}`);
}

// warn : situations anormales non bloquantes (route inconnue, fichier manquant...)
export function warn(message) {
  console.warn(`[${timestamp()}] WARN  ${message}`);
}

// error : erreurs critiques (crash, erreur réseau...)
// err = l'objet Error optionnel — affiché en dessous si présent
export function error(message, err) {
  console.error(`[${timestamp()}] ERROR ${message}`);
  if (err) console.error(err);
}

// request : log d'une requête HTTP entrante
// padEnd(6) aligne les méthodes (GET, POST...) pour des logs lisibles en colonnes
export function request(req) {
  console.log(`[${timestamp()}] REQ   ${req.method.padEnd(6)} ${req.url}`);
}
