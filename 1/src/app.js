// const prenom = process.argv[2] || "tom";
// console.log(`Bonjour ${prenom}`);
// console.log("Node.js :", process.version);
// console.log("Node.js :", process.cwd());
// process.exit(0);

/**
 * Import des functions de calculjs
 * diviser en dehors car default function
 */
import diviser, { additionner, multiplier } from "./utils/calcul.js";

console.log(additionner(5, 2));
console.log(multiplier(5, 2));
console.log(diviser(5, 2));
console.log("toto");
