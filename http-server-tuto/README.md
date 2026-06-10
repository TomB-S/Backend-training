# Serveur HTTP Node.js natif — Architecture du projet

> Diginamic Formation 2026 — Module Node.js — Robin Hotton

---

## Pourquoi ce projet ?

Construire un serveur HTTP **sans framework** (sans Express) force à comprendre ce qui se passe vraiment sous le capot. Chaque ligne de code est visible, rien n'est caché.

---

## Le flux d'une requête

Quand tu tapes `http://localhost:3000/` dans ton navigateur, voici ce qui se passe :

```
Navigateur
    ↓  envoie une requête HTTP (GET /)
index.js        → démarre le serveur
    ↓
server.js       → reçoit req + res, envoie au routeur
    ↓
router/index.js → regarde METHOD + URL, choisit le handler
    ↓
handler         → construit la réponse (HTML, JSON, fichier...)
    ↓
utils/          → outils pour envoyer la réponse
    ↓
Navigateur      → reçoit la réponse
```

---

## Architecture des fichiers

```
http-server-tuto/
│
├── index.js              ← Point de départ — démarre le serveur
├── package.json
│
└── src/
    ├── config.js         ← Configuration centralisée (port, host, dossier public)
    ├── server.js         ← Reçoit chaque requête HTTP et l'envoie au routeur
    │
    ├── router/
    │   └── index.js      ← Regarde METHOD + URL → choisit le bon handler
    │
    ├── handlers/
    │   ├── homeHandler.js      ← GET /          → page HTML d'accueil
    │   ├── apiHandler.js       ← GET /api/hello → JSON simple
    │   │                          GET /api/time  → heure serveur en JSON
    │   │                          POST /api/echo → renvoie le body reçu
    │   ├── staticHandler.js    ← GET /css/*.css, /js/*.js → fichiers du dossier /public
    │   └── notFoundHandler.js  ← toute route inconnue → erreur 404
    │
    ├── utils/
    │   ├── response.js   ← sendJSON / sendHTML / sendError
    │   ├── request.js    ← readBody — lit le body d'une requête POST (stream)
    │   ├── logger.js     ← info / warn / error — logs horodatés dans le terminal
    │   └── mime.js       ← getMimeType — retourne le Content-Type selon l'extension
    │
    └── public/
        ├── css/style.css ← Feuille de style statique
        └── js/app.js     ← Script client (fetch /api/time)
```

---

## Rôle de chaque fichier

### `index.js` — Le point de départ

Exécuté en premier avec `node index.js`. Il fait 3 choses :

1. charge `config.js`
2. crée une instance de `Server`
3. démarre le serveur avec `server.start()`

Il ne contient **aucune logique** — il délègue tout.

---

### `src/config.js` — La configuration centralisée

Un simple objet avec 4 valeurs utilisées partout dans le projet :

| Propriété   | Valeur par défaut | Rôle                           |
| ----------- | ----------------- | ------------------------------ |
| `port`      | `3000`            | Port d'écoute du serveur       |
| `host`      | `0.0.0.0`         | Interface réseau (toutes)      |
| `env`       | `development`     | Environnement (dev / prod)     |
| `publicDir` | `/public`         | Dossier des fichiers statiques |

Les valeurs sont surchargeables via variables d'environnement :

```bash
PORT=8080 node index.js
```

---

### `src/server.js` — La porte d'entrée

Crée le serveur HTTP avec `http.createServer()`. À chaque requête il reçoit :

- `req` — la requête : URL, méthode, headers, body (stream)
- `res` — la réponse : permet d'envoyer statut, headers, corps

Il délègue immédiatement au routeur : `router.dispatch(req, res)`.

Il gère aussi le **graceful shutdown** — fermeture propre quand on fait `Ctrl+C` ou `Docker stop`, sans couper les connexions en cours.

---

### `src/router/index.js` — L'aiguilleur

Regarde deux choses dans la requête :

- la **méthode HTTP** : `GET`, `POST`...
- le **pathname** : `/`, `/api/hello`, `/css/style.css`...

Et applique cet ordre de priorité :

1. Route exacte trouvée dans la table → appelle le handler métier
2. Méthode `GET` + aucune route → `staticHandler` (cherche dans `/public`)
3. Rien trouvé → `notFoundHandler` (404)

---

### `src/handlers/` — Les cuisiniers

Chaque handler est une fonction `(req, res)` responsable d'envoyer **exactement une réponse**.

| Handler           | Routes                       | Réponse                      |
| ----------------- | ---------------------------- | ---------------------------- |
| `homeHandler`     | `GET /`                      | Page HTML d'accueil          |
| `apiHandler`      | `GET /api/hello`             | `{ message: 'Bonjour !' }`   |
| `apiHandler`      | `GET /api/time`              | `{ time: '...' }`            |
| `apiHandler`      | `POST /api/echo`             | Renvoie le body reçu         |
| `staticHandler`   | `GET /css/...` `GET /js/...` | Fichier du dossier `/public` |
| `notFoundHandler` | Tout le reste                | Erreur 404                   |

---

### `src/utils/` — Les ustensiles de cuisine

Fonctions réutilisables par tous les handlers.

#### `response.js`

| Fonction                              | Rôle                    |
| ------------------------------------- | ----------------------- |
| `sendJSON(res, statusCode, data)`     | Envoie une réponse JSON |
| `sendHTML(res, statusCode, html)`     | Envoie une réponse HTML |
| `sendError(res, statusCode, message)` | Envoie une erreur HTTP  |

#### `request.js`

| Fonction        | Rôle                                             |
| --------------- | ------------------------------------------------ |
| `readBody(req)` | Lit le body d'une requête POST (stream → string) |

Le body arrive en **chunks** (morceaux réseau) — on les accumule puis on concatène.

#### `logger.js`

| Fonction         | Niveau | Usage                               |
| ---------------- | ------ | ----------------------------------- |
| `info(message)`  | INFO   | Événements normaux                  |
| `warn(message)`  | WARN   | Situations anormales non bloquantes |
| `error(message)` | ERROR  | Erreurs critiques                   |

#### `mime.js`

| Fonction                | Rôle                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `getMimeType(filePath)` | Retourne le Content-Type selon l'extension (`.css` → `text/css`) |

Sans le bon `Content-Type`, le navigateur ne sait pas interpréter la réponse.

---

## Les `require()` — Comment les fichiers se connectent

```
index.js
  └── require('./src/config')
  └── require('./src/server')
        └── require('./router/index')
              └── require('../handlers/homeHandler')
              └── require('../handlers/apiHandler')
              └── require('../handlers/staticHandler')
              └── require('../handlers/notFoundHandler')

handlers/*.js
  └── require('../utils/response')   ← tous les handlers
  └── require('../utils/request')    ← apiHandler seulement
  └── require('../utils/mime')       ← staticHandler seulement
```

---

## Démarrage et test

```bash
# Démarrer le serveur
node index.js

# Mode watch (rechargement automatique — Node.js >= 18)
node --watch index.js

# Tester avec curl
curl http://localhost:3000/           # page HTML
curl http://localhost:3000/api/hello  # JSON
curl http://localhost:3000/api/time   # heure serveur
curl -X POST http://localhost:3000/api/echo \
     -H "Content-Type: application/json" \
     -d '{"prenom":"Alice"}'          # echo du body
```

---

## Modules natifs utilisés

Aucun `npm install` — tout vient de la bibliothèque standard de Node.js.

| Module    | Rôle                                              |
| --------- | ------------------------------------------------- |
| `http`    | Créer le serveur, manipuler `req` et `res`        |
| `fs`      | Lire les fichiers statiques                       |
| `path`    | Construire des chemins cross-platform             |
| `url`     | Parser l'URL de la requête (`pathname`, `query`)  |
| `Buffer`  | Convertir les chunks binaires en string UTF-8     |
| `process` | Variables d'env, signaux système (SIGINT/SIGTERM) |
