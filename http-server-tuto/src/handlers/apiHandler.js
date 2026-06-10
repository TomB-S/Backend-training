// ============================================================
// src/handlers/apiHandler.js — Handlers API JSON (ESM)
// ============================================================
// ESM : exports nommés multiples depuis un même fichier
// Le routeur importe exactement ce dont il a besoin : { hello, time, echo }
// ============================================================

import { sendJSON, sendError } from "../utils/response.js";
import { readBody } from "../utils/request.js";
import * as logger from "../utils/logger.js";

// hello : GET /api/hello — réponse JSON simple
// process.version = version de Node.js (ex: v20.11.0)
export function hello(req, res) {
  logger.info("apiHandler → GET /api/hello");
  sendJSON(res, 200, {
    message: "Bonjour depuis le serveur HTTP natif Node.js (ESM) !",
    version: process.version,
  });
}

// time : GET /api/time — renvoie l'heure serveur sous 3 formats
export function time(req, res) {
  logger.info("apiHandler → GET /api/time");
  sendJSON(res, 200, {
    timestamp: Date.now(), // millisecondes depuis 1970
    iso: new Date().toISOString(), // format ISO 8601
    locale: new Date().toLocaleString("fr-FR"), // format lisible français
  });
}

// echo : POST /api/echo — renvoie le body reçu tel quel
// async car on attend await readBody(req) — le body arrive en stream
// double try/catch : distingue erreur réseau (500) et JSON invalide (400)
export async function echo(req, res) {
  logger.info("apiHandler → POST /api/echo");

  try {
    const rawBody = await readBody(req); // attend que tous les chunks soient reçus

    let parsed;
    try {
      parsed = JSON.parse(rawBody); // tente de parser le JSON
    } catch {
      // corps reçu mais JSON invalide → erreur client 400
      return sendJSON(res, 400, {
        erreur: "Corps invalide : JSON attendu",
        reçu: rawBody,
      });
    }

    sendJSON(res, 200, { echo: parsed, taille: rawBody.length });
  } catch (err) {
    // erreur lors de la lecture du stream → erreur serveur 500
    logger.error("Erreur lecture body", err);
    sendError(res, 500, "Impossible de lire le corps de la requête");
  }
}
