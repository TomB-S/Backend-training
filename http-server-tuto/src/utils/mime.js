// ============================================================
// src/utils/mime.js — Types MIME (ESM)
// ============================================================
// Sans le bon Content-Type, le navigateur ne sait pas interpréter
// la réponse (afficherait le CSS comme du texte brut)
// ============================================================

import { extname } from "node:path"; // extname('/css/style.css') → '.css'

// Table de correspondance extension → Content-Type
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
};

// getMimeType : retourne le Content-Type selon l'extension du fichier
// .toLowerCase() normalise l'extension (gère .CSS, .Jpg, etc.)
// ?? 'application/octet-stream' = type par défaut si extension inconnue
// → le navigateur proposera un téléchargement
export function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? "application/octet-stream";
}
