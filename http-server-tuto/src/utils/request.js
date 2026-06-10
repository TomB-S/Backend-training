// ============================================================
// src/utils/request.js — Lecture du body HTTP (ESM)
// ============================================================
// ESM : export nommé d'une seule fonction utilitaire
// Buffer et les events sont globaux Node.js — pas d'import nécessaire
// ============================================================

// readBody : lit l'intégralité du corps d'une requête HTTP (stream → string)
// Le body arrive en chunks (morceaux réseau) — on les accumule puis on concatène
// maxBytes = 1 Mo par défaut (1_048_576 = 1024×1024)
// → protège contre les clients malveillants qui satureraient la RAM
export function readBody(req, maxBytes = 1_048_576) {
  return new Promise((resolve, reject) => {
    const chunks = []; // tableau qui accumule les morceaux binaires
    let totalSize = 0; // compteur d'octets reçus

    // événement 'data' : déclenché à chaque nouveau chunk reçu
    req.on("data", (chunk) => {
      totalSize += chunk.length;
      // si le body dépasse la limite → on coupe la connexion et on rejette
      if (totalSize > maxBytes) {
        req.destroy();
        reject(new Error(`Corps trop volumineux (max ${maxBytes} octets)`));
        return;
      }
      chunks.push(chunk);
    });

    // événement 'end' : tous les chunks sont arrivés
    // Buffer.concat() fusionne les chunks → .toString('utf8') convertit en string
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));

    // événement 'error' : erreur réseau → on rejette la Promise
    req.on("error", (err) => reject(err));
  });
}
