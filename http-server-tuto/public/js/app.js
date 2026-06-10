// public/js/app.js — Script côté CLIENT (navigateur)
// Ce fichier tourne dans le navigateur, pas dans Node.js
// Il est chargé via <script src="/js/app.js" type="module"> dans homeHandler
// Le fetch('/api/time') boucle la boucle : le client appelle l'API du serveur

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // appelle l'API du serveur qu'on vient d'écrire
    const res = await fetch("/api/time");
    const data = await res.json();

    // crée un paragraphe et l'ajoute dans la page
    // textContent (pas innerHTML) — pas de risque XSS
    const p = document.createElement("p");
    p.textContent = `Heure serveur : ${data.locale}`;
    document.querySelector("main").appendChild(p);
  } catch (err) {
    console.error("Impossible de joindre /api/time", err);
  }
});
