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
/questions-reponses         ← dossier racine (pas de package.json ici)
  /qr-import                ← Application 1 : importe le CSV, génère le JSON
  /qr-data                  ← Application 2 : expose le JSON via une API HTTP
  /qr-console-app           ← Application 3 : quiz interactif en ligne de commande
```

---

## Détail par application

### `/qr-import` — Importateur CSV

Lit le fichier CSV source et génère le fichier `db.json` consommé par `qr-data`.

```
/qr-import
  package.json                          → "type": "module" + scripts npm (start, dev)
  /csv
    question-reponse-sans-texte.csv     → fichier source téléchargé sur data.gouv.fr
  /src
    app.js                              → couche PRÉSENTATION : menu interactif, saisies utilisateur
    import.service.js                   → couche SERVICE : lecture CSV, écriture JSON (jamais de console.log)
```

**Rôle de chaque fichier :**

| Fichier             | Couche       | Responsabilité                                                                                                 |
| ------------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| `app.js`            | Présentation | Affiche le menu (4 choix), lit les saisies, appelle le service, affiche les résultats                          |
| `import.service.js` | Service      | `importerCSV()` → lit le CSV, retourne un tableau d'objets. `exporterJSON()` → écrit `db.json` dans `/qr-data` |

**Menu disponible :**

```
1. Importer les données CSV
2. Afficher le nombre de questions
3. Afficher une question par identifiant
99. Sortir
```

**Format du fichier `db.json` généré :**

```json
{
  "questions-reponses": [
    {
      "id": 1,
      "question": "Quel architecte fût à l'origine des plans du Woolworth building ?",
      "reponse": "Cass Gilbert"
    }
  ]
}
```

---

### `/qr-data` — API HTTP

Expose les données de `db.json` via une API REST automatique grâce à `json-server`.  
**Aucune logique métier ici** — `json-server` génère toutes les routes automatiquement.

```
/qr-data
  package.json    → dépendance json-server + script de démarrage
  db.json         → généré par qr-import (ne pas créer à la main)
  /src
    app.js        → lance json-server sur le port 3001
```

**Routes disponibles automatiquement sur `http://localhost:3001` :**

| Méthode | URL                     | Description            |
| ------- | ----------------------- | ---------------------- |
| GET     | `/questions-reponses`   | Toutes les questions   |
| GET     | `/questions-reponses/1` | Question par id        |
| POST    | `/questions-reponses`   | Créer une question     |
| PUT     | `/questions-reponses/1` | Modifier une question  |
| DELETE  | `/questions-reponses/1` | Supprimer une question |

---

### `/qr-console-app` — Quiz interactif

Propose un quiz en ligne de commande en récupérant les questions depuis l'API `qr-data`.

```
/qr-console-app
  package.json      → "type": "module" + scripts npm (start, dev)
  /src
    app.js          → couche PRÉSENTATION : pseudo, questions, score final
    quiz.service.js → couche SERVICE : appels HTTP vers qr-data via fetch natif (Node.js 18+)
```

**Rôle de chaque fichier :**

| Fichier           | Couche       | Responsabilité                                                                          |
| ----------------- | ------------ | --------------------------------------------------------------------------------------- |
| `app.js`          | Présentation | Demande le pseudo, affiche les questions avec propositions numérotées, affiche le score |
| `quiz.service.js` | Service      | `recupererQuestionsAleatoires(n)` → fetch vers qr-data, mélange, retourne n questions   |

**Déroulement du quiz :**

1. Demande un pseudo à l'utilisateur
2. Récupère 5 questions aléatoires depuis `qr-data`
3. Pour chaque question : affiche la bonne réponse + 4 distracteurs mélangés
4. L'utilisateur choisit un numéro
5. Affiche le score final en pourcentage

---

## Relations entre les 3 applications

```
qr-import ──écrit──► db.json ──lu par──► qr-data ──HTTP GET──► qr-console-app
```

- `qr-import` et `qr-data` partagent un **fichier sur le disque** (`db.json`)
- `qr-data` et `qr-console-app` communiquent via le **réseau HTTP local**
- Les 3 apps ne s'importent **jamais directement** entre elles

---

## Principe des couches

Chaque application (sauf `qr-data`) est découpée en **2 couches** :

| Couche       | Fichier        | Règle                                                                |
| ------------ | -------------- | -------------------------------------------------------------------- |
| Présentation | `app.js`       | Parle à l'utilisateur : affiche, lit les saisies, appelle le service |
| Service      | `*.service.js` | Logique métier uniquement : **interdit de faire des `console.log`**  |

**Pourquoi ?** Si demain on remplace le menu en ligne de commande par une interface web, on réécrit uniquement `app.js`. La logique du service ne change pas.

---

## Ordre de démarrage

Les 3 apps doivent être lancées dans cet ordre :

```bash
# 1. Générer db.json (une seule fois, ou après mise à jour du CSV)
cd qr-import && npm start
# → choisir option 1 dans le menu

# 2. Démarrer l'API
cd ../qr-data && npm start
# → API disponible sur http://localhost:3001

# 3. Lancer le quiz (dans un nouveau terminal)
cd ../qr-console-app && npm start
```

---

## Module system

Toutes les applications utilisent **ESM (ES Modules)** déclaré via `"type": "module"` dans chaque `package.json`.

| Syntaxe ESM                                       | Syntaxe CommonJS (à éviter)          |
| ------------------------------------------------- | ------------------------------------ |
| `import { fn } from './module.js'`                | `const { fn } = require('./module')` |
| `export function fn() {}`                         | `module.exports = { fn }`            |
| `import.meta.url` (pour reconstruire `__dirname`) | `__dirname` disponible nativement    |

---

_Diginamic Formation 2026 · CDA JS Fullstack IA · Robin Hotton_
