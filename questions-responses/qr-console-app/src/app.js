// src/app.js
// Couche PRÉSENTATION : affiche le quiz, lit les saisies, affiche le score

// readline permet de lire les saisies de l'utilisateur dans le terminal
import * as readline from "node:readline/promises";

// stdin = entrée clavier / stdout = affichage terminal
import { stdin as input, stdout as output } from "node:process";

// On importe la fonction du service
import { recupererQuestionsAleatoires } from "./quiz.service.js";

// Interface readline pour lire les saisies utilisateur
const rl = readline.createInterface({ input, output });

async function main() {
  console.log("🎯 Bienvenue dans le Quiz !");

  // Demande le pseudo à l'utilisateur
  const pseudo = (await rl.question("Votre pseudo : ")).trim();

  // Récupère 5 questions aléatoires depuis qr-data via le service
  const questions = await recupererQuestionsAleatoires(5);

  // Compteur de bonnes réponses
  let score = 0;

  // On boucle sur chaque question
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    // Construit les distracteurs : les réponses des AUTRES questions (pas la question courante)
    // filter() exclut la question courante par son index
    // map() extrait uniquement la réponse de chaque question
    const distracteurs = questions
      .filter((_, j) => j !== i)
      .map((a) => a.reponse);

    // Mélange la bonne réponse avec les distracteurs
    // [...distracteurs] crée une copie pour ne pas modifier l'original
    const propositions = [q.reponse, ...distracteurs].sort(
      () => Math.random() - 0.5,
    );

    // Affiche la question et les propositions numérotées
    console.log(`\n--- Question ${i + 1}/${questions.length} ---`);
    console.log(q.question);
    propositions.forEach((p, idx) => console.log(`  ${idx + 1}. ${p}`));

    // Lit la réponse de l'utilisateur
    const rep = await rl.question("Votre réponse (numéro) : ");

    // Récupère la proposition choisie par l'utilisateur
    // parseInt() convertit la saisie string en nombre
    // -1 car les propositions sont affichées à partir de 1 mais le tableau commence à 0
    const choisi = propositions[parseInt(rep) - 1];

    // Compare la réponse choisie avec la bonne réponse
    if (choisi === q.reponse) {
      console.log("✅ Correct !");
      score++;
    } else {
      console.log(`❌ Incorrect. Réponse : ${q.reponse}`);
    }
  }

  // Calcule et affiche le score final en pourcentage
  const pct = Math.round((score / questions.length) * 100);
  console.log(
    `\n🏆 Résultat de ${pseudo} : ${score}/${questions.length} (${pct}%)`,
  );

  rl.close();
}

// Lance la fonction principale
// .catch() attrape toutes les erreurs non gérées
main().catch(console.error);
