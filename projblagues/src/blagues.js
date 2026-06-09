/**
 * Tableau de blagues
 * La déclaration est une constance (readonly)
 * public (export) donc import possible dans script externe
 */
export const blagues = [
  "Pourquoi les devs confondent Halloween",
  "et Noel ? Oct 31 == Dec 25 !",
  "Un dev senior vs junior : le senior",
  "sait pourquoi ca ne marche pas.",
  "Il y a 10 types de personnes :",
  "ceux qui comprennent le binaire...",
];

/**
 * Déclaration de function + public (export)
 * Algo = random() pour donner blague au hasard + floor() pour arrondir
 * @returns un élément du tableau blagues
 */
export function blagueDuJour() {
  const i = Math.floor(Math.random() * blagues.length);
  return blagues[i];
}
