import { readFile } from "node:fs/promises";

async function lireFichier() {
  try {
    // await attend chargement de tout le fichier
    const contenu = await readFile("data.txt", "utf8");
    // affichage se fait à la fin du chargement
    console.log(contenu);
  } catch (error) {
    console.log(`Erreur : ${error.message}`);
  }
}

lireFichier();
