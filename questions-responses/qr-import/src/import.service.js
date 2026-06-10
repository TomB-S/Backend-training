// src/import.service.js
// Couche SERVICE : gère toutes les interactions avec les fichiers (lecture CSV, écriture JSON)
// RÈGLE : cette couche ne fait JAMAIS de console.log — elle retourne des données, c'est tout

// On importe les fonctions de lecture/écriture/création de dossier depuis le module natif fs
// 'node:fs/promises' = version asynchrone (avec await) du module filesystem de Node.js
import { readFile, writeFile, mkdir } from "node:fs/promises";

// resolve() construit un chemin absolu à partir de morceaux
// dirname() extrait le dossier parent d'un chemin de fichier
import { resolve, dirname } from "node:path";

// fileURLToPath() convertit une URL de fichier (import.meta.url) en chemin système
// Nécessaire en ESM car __dirname n'existe pas (c'est une variable CommonJS)
import { fileURLToPath } from "node:url";

// Reconstitution manuelle de __dirname pour les modules ESM
// import.meta.url = URL du fichier courant (ex: file:///Users/Tom/.../import.service.js)
// fileURLToPath() le transforme en chemin système (/Users/Tom/.../import.service.js)
// dirname() en extrait le dossier (/Users/Tom/.../)
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Lit un fichier CSV de questions-réponses et retourne un tableau d'objets.
 * @param {string} cheminRelatif - Chemin relatif depuis le dossier src/
 * @returns {Promise<Array<{id, question, reponse}>>} - Tableau de questions
 */
export async function importerCSV(cheminRelatif) {
  // resolve() construit le chemin absolu depuis __dirname
  // '..' remonte d'un niveau (de src/ vers qr-import/)
  const chemin = resolve(__dirname, "..", cheminRelatif);

  // Lecture du fichier en UTF-8 — retourne une grande string avec tout le contenu
  const contenu = await readFile(chemin, "utf-8");

  // On découpe le contenu ligne par ligne sur les sauts de ligne '\n'
  // .filter() supprime les lignes vides (trim() enlève les espaces, si vide = falsy)
  const lignes = contenu.split("\n").filter((l) => l.trim());

  // slice(1) saute la première ligne qui est l'en-tête du CSV (noms des colonnes)
  // .map() transforme chaque ligne texte en objet {id, question, reponse}
  return lignes
    .slice(1)
    .map((ligne, index) => {
      // Le séparateur du CSV est le point-virgule ';'
      const colonnes = ligne.split(",");

      return {
        id: index + 1, // identifiant numérique à partir de 1
        question: colonnes[0]?.trim() ?? "", // colonne 0 = question, trim() enlève les espaces
        reponse: colonnes[1]?.trim() ?? "", // colonne 1 = réponse
        // ?. = optional chaining : évite un crash si colonnes[0] est undefined
        // ?? '' = nullish coalescing : retourne '' si la valeur est null ou undefined
      };
    })
    .filter((q) => q.question && q.reponse); // on garde uniquement les entrées complètes
}

/**
 * Écrit un tableau de questions dans un fichier JSON.
 * @param {Array} questions - Le tableau retourné par importerCSV()
 * @param {string} cheminSortie - Chemin absolu du fichier de destination
 * @returns {Promise<number>} - Nombre de questions écrites
 */
export async function exporterJSON(questions, cheminSortie) {
  // Crée le dossier de destination si il n'existe pas encore
  // recursive: true = ne plante pas si le dossier existe déjà
  await mkdir(dirname(cheminSortie), { recursive: true });

  // JSON.stringify() convertit le tableau JS en texte JSON
  // null = pas de fonction de remplacement personnalisée
  // 2 = indentation de 2 espaces pour un JSON lisible
  const json = JSON.stringify({ "questions-reponses": questions }, null, 2);

  // Écriture du fichier en UTF-8
  await writeFile(cheminSortie, json, "utf-8");

  // On retourne le nombre de questions pour que app.js puisse l'afficher
  return questions.length;
}
