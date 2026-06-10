// src/app.js
// Couche PRÉSENTATION : affiche le menu, lit les saisies, appelle le service

// readline permet de lire les saisies de l'utilisateur dans le terminal
import * as readline from "node:readline/promises";

// stdin = entrée clavier / stdout = affichage terminal
import { stdin as input, stdout as output } from "node:process";

// Pour construire des chemins de fichiers
import { resolve, dirname } from "node:path";

// Pour reconstruire __dirname en ESM
import { fileURLToPath } from "node:url";

// On importe les deux fonctions du service
import { importerCSV, exporterJSON } from "./import.service.js";

// Reconstruction de __dirname (inexistant en ESM)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Interface readline pour lire les saisies utilisateur
const rl = readline.createInterface({ input, output });

// Chemin absolu vers db.json dans le projet qr-data
// __dirname = .../qr-import/src/
// '../..' remonte à .../questions-reponses/
// puis on descend dans qr-data/db.json
const CHEMIN_DB = resolve(__dirname, "../../qr-data/db.json");

// Affiche le menu dans le terminal
function afficherMenu() {
  console.log("\n=== QR-IMPORT ===");
  console.log("1. Importer les données CSV");
  console.log("2. Afficher le nombre de questions");
  console.log("3. Afficher une question");
  console.log("99. Sortir");
}

async function main() {
  console.log("** QR-IMPORT **");

  // Ce tableau stocke les questions en mémoire après l'import
  // Il commence vide et se remplit au choix 1
  let questions = [];

  // Boucle infinie — le menu se réaffiche après chaque action
  while (true) {
    afficherMenu();

    // On attend que l'utilisateur tape quelque chose et appuie sur Entrée
    const choix = (await rl.question("> ")).trim();

    switch (choix) {
      case "1":
        // 1. Lire le CSV — retourne un tableau d'objets {id, question, reponse}
        questions = await importerCSV("csv/question-reponse-sans-texte.csv");

        // 2. Écrire le tableau dans db.json
        await exporterJSON(questions, CHEMIN_DB);

        // 3. Afficher la progression toutes les 500 questions
        for (let i = 500; i <= questions.length; i += 500) {
          console.log(`${i} questions importées...`);
        }

        // 4. Afficher le total
        console.log(`Total : ${questions.length} questions importées.`);
        break;

      case "2":
        // Affiche simplement le nombre d'éléments dans le tableau
        console.log(`Nombre de questions : ${questions.length}`);
        break;

      case "3":
        // 1. Demander un id à l'utilisateur
        const idSaisi = (await rl.question("Entrez un identifiant : ")).trim();

        // 2. Convertir la saisie (string) en nombre entier
        const idRecherche = parseInt(idSaisi);

        // 3. Chercher la question dont l'id correspond
        // find() parcourt le tableau et retourne le premier élément qui correspond
        // Si rien ne correspond, il retourne undefined
        const question = questions.find((q) => q.id === idRecherche);

        // 4. Afficher le résultat ou un message d'erreur
        if (question) {
          console.log(`Q: ${question.question}`);
          console.log(`R: ${question.reponse}`);
        } else {
          console.log("Question non trouvée.");
        }
        break;

      case "99":
        console.log("Au revoir !");
        rl.close();
        process.exit(0);

      default:
        console.log("Choix invalide.");
    }
  }
}

// Lance la fonction principale
// .catch() attrape toutes les erreurs non gérées et les affiche
main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
