// ============================================================
// src/handlers/homeHandler.js — Handler page d'accueil (ESM)
// ============================================================

import * as logger from "../utils/logger.js";
import { sendHTML } from "../utils/response.js";

// get : répond à GET / avec une page HTML de bienvenue
// le HTML est un template literal (backticks) — pratique pour le multi-ligne
// <link> et <script> déclenchent 2 requêtes GET supplémentaires
// → servies automatiquement par staticHandler
export function get(req, res) {
  logger.info("homeHandler → GET /");

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Serveur HTTP Node.js natif — ESM</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <h1>Serveur HTTP Node.js — ES Modules</h1>
    <p>Bienvenue ! Ce serveur tourne avec le module <code>node:http</code> natif en ESM.</p>
    <ul>
      <li><a href="/api/hello">GET /api/hello</a> — réponse JSON simple</li>
      <li><a href="/api/time">GET /api/time</a> — heure serveur en JSON</li>
      <li>POST /api/echo — renvoie le corps de la requête</li>
    </ul>
  </main>
  <script src="/js/app.js" type="module"></script>
</body>
</html>`;

  sendHTML(res, 200, html);
}
