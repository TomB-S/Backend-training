import { blagueDuJour } from "./blagues.js";
/**On récupère les paramètres en ligne */
const prenom = process.argv[2] || "Dev";
const nb = parseInt(process.argv[3]) || 1;

console.log("=".repeat(40));
console.log(`Blague du jour pour ${prenom}!`);
console.log("=".repeat(40));
// On fait une boucle for selon nb (par défaut 1)
for (let i = 0; i < nb; i++) {
  console.log(`\n ${i + 1}. ${blagueDuJour()}`);
}
