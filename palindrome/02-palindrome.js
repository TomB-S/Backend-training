// ============================================================
// 🟢 ALGO 02 — Palindrome & Anagramme
// ============================================================
//
// 🎯 DÉFI A — estPalindrome(texte)
//   Retourne true si le texte se lit pareil à l'endroit et à l'envers.
//   Ignorer la casse et les espaces.
//   Ex: "Kayak" → true  |  "Never odd or even" → true  |  "Bonjour" → false
//
// 🎯 DÉFI B — trouverPalindromes(phrase)
//   Reçoit une phrase, retourne un tableau avec tous les mots
//   de la phrase qui sont des palindromes (longueur > 1).
//   Ex: "Le kayak et le radar sont géniaux" → ['kayak', 'radar']
//
// 💡 INDICES
//   Indice 1 : str.split('').reverse().join('') retourne la chaîne inversée
//   Indice 2 : str.toLowerCase().replace(/\s/g, '') pour normaliser
//   Indice 3 : pour DÉFI B, découpe la phrase en mots avec split(' ')
//              puis filtre avec estPalindrome
//
// 🔥 BONUS : compterPalindromes(n)
//   Compte le nombre d'entiers palindromes entre 1 et n.
//   Ex: n=200 → 18  (1,2,...,9,11,22,33,44,55,66,77,88,99,101,111,121,131,141,151)
//
// ▶  node base/02-palindrome.js
// ============================================================

// ✏️  TON CODE ICI ↓

// ─── DEFI 1 ───
function estPalindrome(texte) {
  const normalise = texte.toLowerCase().replace(/\s/g, "");
  const inverse = normalise.split("").reverse().join("");
  // faire return condition car plus court
  return normalise === inverse;
}

// ─── DEFI 2 ───
// 1st WAY
// function trouverPalindromes(phrase) {
//   const words = phrase.split(" ");
//   const resultat = words.filter(
//     (word) => word.length > 1 && estPalindrome(word),
//   );
//   return resultat;
// }

// 2ND WAY
function trouverPalindromes(phrase) {
  const words = phrase.split(" ");
  const resultat = [];
  words.forEach((el) => {
    if (el.length > 1 && estPalindrome(el)) resultat.push(el);
  });
  return resultat;
}

// ─── DEFI 3 ───
function compterPalindromes(n) {
  // compteur de palindromes trouvés
  let count = 0;
  for (let i = 1; i <= n; i++) {
    // convertit i en string et teste si palindrome
    if (estPalindrome(i.toString())) {
      count++; // incrémente le compteur si palindrome détecté
      console.log(i);
    }
  }
  return count; // retourne le nombre total de palindromes
}

console.log(compterPalindromes(100));
compterPalindromes(200);

// ─── Tests ──────────────────────────────────────────────────
function tester(nom, obtenu, attendu) {
  const ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
  console.log(`${ok ? "✅" : "❌"} ${nom}`);
  if (!ok) {
    console.log("   Obtenu  :", JSON.stringify(obtenu));
    console.log("   Attendu :", JSON.stringify(attendu));
  }
}

// Défi A
tester("Kayak → true", estPalindrome("Kayak"), true);
tester("Never odd or even → true", estPalindrome("Never odd or even"), true);
tester("Bonjour → false", estPalindrome("Bonjour"), false);
tester("A → true", estPalindrome("A"), true);
tester("ab → false", estPalindrome("ab"), false);

// Défi B
tester(
  "trouverPalindromes",
  trouverPalindromes("Le kayak et le radar sont géniaux mais le non aussi"),
  ["kayak", "radar", "non"],
);
