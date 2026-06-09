/**
 * Commentaire - Documentation
 * Author: T B-S
 */
export function additionner(a, b) {
  return a + b;
}

export function multiplier(a, b) {
  return a * b;
}

export default function diviser(a, b) {
  /**
   * je déclenche une erreur si b = 0
   */
  if (b === 0) throw new Error("Impossible de diviser par 0");
  return a / b;
}
