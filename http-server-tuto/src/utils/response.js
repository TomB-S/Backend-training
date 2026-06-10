// ============================================================
// src/utils/response.js — Helpers de réponse HTTP (ESM)
// ============================================================
// ESM : exports nommés multiples
// L'appelant importe exactement ce dont il a besoin :
//   import { sendJSON } from '../utils/response.js'
//   import { sendJSON, sendHTML } from '../utils/response.js'
// ============================================================

// sendJSON : envoie une réponse au format JSON
// Buffer.byteLength(body) ≠ body.length — UTF-8 peut avoir des caractères
// multi-octets (accents, emojis...) — Content-Length se mesure en octets
export function sendJSON(res, statusCode, data) {
  const body = JSON.stringify(data, null, 2); // null, 2 = indenté — lisible dans curl
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body); // envoie le corps et ferme la connexion
}

// sendHTML : envoie une réponse au format HTML
// html est déjà une string — pas besoin de JSON.stringify
export function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(html),
  });
  res.end(html);
}

// sendError : envoie une erreur en texte brut
// utilisé pour les 403, 404, 500...
export function sendError(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end(message);
}
