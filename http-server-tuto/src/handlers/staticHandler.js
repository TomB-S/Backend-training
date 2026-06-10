// ============================================================
// src/handlers/staticHandler.js — Fichiers statiques (ESM)
// ============================================================
// Deux concepts clés :
// 1. Sécurité path traversal — vérifie que le chemin reste dans /public
// 2. Streaming avec pipe — lit le fichier par morceaux, économise la RAM
// ============================================================

import { stat, createReadStream } from "node:fs";
import { resolve, join } from "node:path";
import config from "../config.js";
import * as logger from "../utils/logger.js";
import { getMimeType } from "../utils/mime.js";
import { sendError } from "../utils/response.js";

// serve : sert un fichier statique depuis config.publicDir
// pathname = le chemin extrait de l'URL (ex: '/css/style.css')
export function serve(req, res, pathname) {
  // resolve() normalise le chemin (supprime les ../ etc.)
  // join() construit le chemin complet vers le fichier dans /public
  const filePath = resolve(join(config.publicDir, pathname));

  // Sécurité path traversal :
  // si l'URL est '/../../../etc/passwd', filePath sortirait de /public
  // on vérifie qu'il commence toujours par config.publicDir
  if (!filePath.startsWith(config.publicDir)) {
    logger.warn(`Path traversal bloqué : ${pathname}`);
    return sendError(res, 403, "Accès interdit");
  }

  // stat() vérifie l'existence du fichier sans bloquer le thread principal
  // c'est une fonction asynchrone à callback
  stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // fichier inexistant ou c'est un dossier → 404
      return sendError(res, 404, `Fichier introuvable : ${pathname}`);
    }

    const mimeType = getMimeType(filePath); // ex: '.css' → 'text/css; charset=utf-8'

    res.writeHead(200, {
      "Content-Type": mimeType,
      "Content-Length": stats.size, // taille exacte du fichier en octets
    });

    // createReadStream lit le fichier par morceaux (chunks)
    // .pipe(res) branche le flux fichier directement sur la réponse HTTP
    // → on ne charge jamais tout le fichier en RAM
    const stream = createReadStream(filePath);
    stream.pipe(res);

    // si une erreur survient pendant le streaming
    stream.on("error", (streamErr) => {
      logger.error("Erreur stream fichier statique", streamErr);
      res.end(); // ferme proprement la connexion
    });
  });
}
