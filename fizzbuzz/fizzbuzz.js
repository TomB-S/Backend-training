// ============================================================
// ✅ SOLUTION 01 — FizzBuzz (version boucles)
// ============================================================
// ⚠️  À lire SEULEMENT après avoir essayé au moins 20 minutes !
// ============================================================

function fizzBuzz(n) {
  const résultat = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0)
      résultat.push("FizzBuzz"); // 3 × 5 — vérifier EN PREMIER
    else if (i % 3 === 0) résultat.push("Fizz");
    else if (i % 5 === 0) résultat.push("Buzz");
    else résultat.push(i);
  }
  return résultat;
}

// 🔥 VARIANTE BONUS — FizzBuzz personnalisé
function fizzBuzzPersonnalise(n, regles) {
  const résultat = [];
  for (let i = 1; i <= n; i++) {
    let mot = "";
    for (const r of regles) {
      if (i % r.diviseur === 0) mot += r.mot;
    }
    résultat.push(mot || i);
  }
  return résultat;
}

// ─── Démonstration ───────────────────────────────────────────
console.log("=== FizzBuzz classique (n=20) ===");
console.log(fizzBuzz(20).join(", "));

console.log("\n=== FizzBuzz Fizz/Buzz/Bazz (diviseurs 3/5/7) ===");
const reglesCustom = [
  { diviseur: 3, mot: "Fizz" },
  { diviseur: 5, mot: "Buzz" },
  { diviseur: 7, mot: "Bazz" },
];
console.log(fizzBuzzPersonnalise(21, reglesCustom).join(", "));
// 21 = 3×7 → FizzBazz  |  35 = 5×7 → BuzzBazz  |  105 = 3×5×7 → FizzBuzzBazz

// ─── Points clés à retenir ───────────────────────────────────
console.log(`
📌 Points clés :
  • Tester d'abord i % 15 (car 15 = 3×5 — le plus restrictif)
  • Boucle for classique : for (let i = 1; i <= n; i++)
  • La variante bonus : boucle for...of sur les règles pour concaténer le mot
`);
