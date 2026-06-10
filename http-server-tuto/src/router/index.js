// ============================================================
// src/router/index.js — Routeur principal (ESM)
// ============================================================
// ESM : on importe les fonctions nommées directement avec { }
// Le renommage à l'import (as) évite les collisions de noms
// entre handlers qui exportent tous get, handle, serve...
// ============================================================

import { parse } from "node:url";

// renommage à l'import car plusieurs handlers pourraient exporter 'get' ou 'handle'
import { get as homeGet } from "../handlers/homeHandler.js";
import { hello, time, echo } from "../handlers/apiHandler.js";
import { serve as staticServe } from "../handlers/staticHandler.js";
import { handle as notFoundHandle } from "../handlers/notFoundHandler.js";

// ============================================================
// Table de routage : (méthode + pathname) → handler
// ============================================================
const routes = {
  GET: {
    "/": homeGet, // page d'accueil HTML
    "/api/hello": hello, // réponse JSON simple
    "/api/time": time, // heure serveur en JSON
  },
  POST: {
    "/api/echo": echo, // renvoie le body reçu
  },
};

// ============================================================
// dispatch — seule fonction exportée du routeur
// ============================================================
// Ordre de priorité :
// 1. Route exacte trouvée dans la table → handler métier
// 2. Méthode GET + aucune route → staticServe (cherche dans /public)
// 3. Rien trouvé → notFoundHandle (404)
export function dispatch(req, res) {
  // parse() décompose '/api/hello?foo=bar' en { pathname: '/api/hello', query: {...} }
  // true = active le parsing de la query string
  const { pathname } = parse(req.url, true);

  // toUpperCase() normalise la méthode (sécurité si jamais elle arriverait en minuscules)
  const method = req.method.toUpperCase();

  // optional chaining ?. évite un crash si la méthode n'existe pas dans la table
  // ex: DELETE n'est pas dans routes → routes['DELETE'] = undefined → crash sans ?.
  const methodRoutes = routes[method];
  if (methodRoutes?.[pathname]) {
    return methodRoutes[pathname](req, res); // route exacte trouvée → appel du handler
  }

  if (method === "GET") {
    // pas de route GET correspondante → on cherche un fichier dans /public
    return staticServe(req, res, pathname);
  }

  // aucune correspondance → 404
  notFoundHandle(req, res);
}
