# Système de Quiz — Node.js

TP 01 — Scripting Node.js · Diginamic Formation 2026 · Robin Hotton

---

## Vue d'ensemble

Ce projet est composé de **3 applications Node.js indépendantes** qui communiquent entre elles pour former un système de quiz interactif en ligne de commande.

```
[CSV]  →  qr-import  →  db.json  →  qr-data (API HTTP)  →  qr-console-app
```

---

## Architecture globale

```
/questions-reponses             ← dossier racine (pas de package.json ici)
  /qr-import                    ← Application 1 : lit le CSV, génère db.json
  /qr-data                      ← Application 2 : expose db.json via API HTTP
  /qr-console-app               ← Application 3 : quiz interactif en ligne de commande
```

---

## Détail par application

### `/qr-import` — Importateur CSV

```
/qr-import
  package.json
  /csv
    question-reponse-sans-texte.csv   ← fichier source (data.gouv.fr)
  /src
    app.js                            ← couche PRÉSENTATION : menu, saisies utilisateur
    import.service.js                 ← couche SERVICE : lecture CSV, écriture JSON
```

**Menu disponible :**

```
1. Importer les données CSV
2. Afficher le nombre de questions
3. Afficher une question par identifiant
99. Sortir
```

**Ce que fait chaque fichier :**

| Fichier             | Couche       | Rôle                                                                                |
| ------------------- | ------------ | ----------------------------------------------------------------------------------- |
| `app.js`            | Présentation | Affiche le menu, lit les saisies, appelle le service, affiche les résultats         |
| `import.service.js` | Service      | `importerCSV()` lit le CSV et retourne un tableau. `exporterJSON()` écrit `db.json` |

---

### `/qr-data` — API HTTP

```
/qr-data
  package.json       ← dépendance json-server, script de démarrage sur port 3001
  db.json            ← généré par qr-import (ne pas créer à la main)
```

`json-server` lit `db.json` et génère automatiquement une API REST complète. Aucun code serveur à écrire.

**Routes disponibles sur `http://localhost:3001` :**

| Méthode | URL                     | Description          |
| ------- | ----------------------- | -------------------- |
| GET     | `/questions-reponses`   | Toutes les questions |
| GET     | `/questions-reponses/1` | Question par id      |
| POST    | `/questions-reponses`   | Créer                |
| PUT     | `/questions-reponses/1` | Modifier             |
| DELETE  | `/questions-reponses/1` | Supprimer            |

---

### `/qr-console-app` — Quiz interactif

```
/qr-console-app
  package.json
  /src
    app.js            ← couche PRÉSENTATION : pseudo, questions, score
    quiz.service.js   ← couche SERVICE : appels HTTP vers qr-data via fetch natif
```

**Ce que fait chaque fichier :**

| Fichier           | Couche       | Rôle                                                                                  |
| ----------------- | ------------ | ------------------------------------------------------------------------------------- |
| `app.js`          | Présentation | Demande le pseudo, affiche questions + propositions, affiche le score final           |
| `quiz.service.js` | Service      | `recupererQuestionsAleatoires(n)` : fetch vers qr-data, mélange, retourne n questions |

**Déroulement du quiz :**

1. Demande un pseudo
2. Récupère 5 questions aléatoires via l'API
3. Pour chaque question : affiche la bonne réponse + 4 distracteurs mélangés
4. L'utilisateur choisit un numéro
5. Affiche le score final en pourcentage

---

## Relations entre les 3 applications

```
qr-import ──écrit──► db.json ──lu par──► qr-data ──HTTP GET──► qr-console-app
```

- `qr-import` et `qr-data` partagent un **fichier sur le disque** (`db.json`)
- `qr-data` et `qr-console-app` communiquent via **HTTP local**
- Les 3 apps ne s'importent **jamais directement** entre elles

---

## Principe des couches

| Couche       | Fichier        | Règle absolue                                                        |
| ------------ | -------------- | -------------------------------------------------------------------- |
| Présentation | `app.js`       | Parle à l'utilisateur : affiche, lit les saisies, appelle le service |
| Service      | `*.service.js` | Logique métier uniquement — **interdit de faire des `console.log`**  |

---

## Ordre de démarrage

```bash
# Terminal 1 — générer db.json (une seule fois)
cd qr-import && npm start
# → choisir option 1 dans le menu

# Terminal 2 — démarrer l'API (laisser tourner)
cd qr-data && npm start

# Terminal 3 — lancer le quiz
cd qr-console-app && npm start
```

> `qr-data` doit toujours tourner avant de lancer `qr-console-app`.

---

## Module system : ESM uniquement

Toutes les applications utilisent **ESM** déclaré via `"type": "module"` dans chaque `package.json`.

| ESM (à utiliser)                                | CommonJS (à éviter)                  |
| ----------------------------------------------- | ------------------------------------ |
| `import { fn } from './module.js'`              | `const { fn } = require('./module')` |
| `export function fn() {}`                       | `module.exports = { fn }`            |
| `import.meta.url` pour reconstruire `__dirname` | `__dirname` natif                    |

---

_Diginamic Formation 2026 · CDA JS Fullstack IA · Robin Hotton_
