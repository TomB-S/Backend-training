// ============================================================
// src/handlers/notFoundHandler.js — Handler 404 (ESM)
// ============================================================
// Content negotiation : la réponse s'adapte au header Accept du client
// curl -H "Accept: application/json" → reçoit du JSON
// navigateur (Accept: text/html) → reçoit une page HTML
// ============================================================

import { sendJSON, sendHTML } from "../utils/response.js";
import * as logger from "../utils/logger.js";

// handle : répond à toute route inconnue avec un 404
export function handle(req, res) {
  logger.warn(`404 — ${req.method} ${req.url}`);

  // on lit le header Accept pour adapter le format de la réponse
  const accept = req.headers["accept"] || "";

  if (accept.includes("application/json")) {
    // client API (curl, Thunder Client...) → réponse JSON
    return sendJSON(res, 404, {
      erreur: "Route introuvable",
      méthode: req.method,
      url: req.url,
    });
  }

  // navigateur → réponse HTML
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>404 — Page introuvable</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <h1>404 — Page introuvable</h1>
    <p>La route <code>${req.method} ${req.url}</code> n'existe pas.</p>
    <a href="/">← Retour à l'accueil</a>
  </main>
</body>
</html>`;

  sendHTML(res, 404, html);
}
