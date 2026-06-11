//? DishModel est le pont vers MySQL — chaque route va appeler
//?  une méthode du modèle pour lire ou modifier les données.

// le driver qui permet à Node.js de parler à MySQL
import mysql from "mysql2/promise";
// charge automatiquement les variables de  .env dans process.env.
import "dotenv/config";

// Création du pool de connexions MySQL
// pool = ensemble de connexions maintenues ouvertes en permanence
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Adresse du serveur MySQL (localhost)
  user: process.env.DB_USER, // Nom d'utilisateur MySQL
  password: process.env.DB_PASSWORD, // Mot de passe MySQL
  database: process.env.DB_NAME, // Nom de la base de données à utiliser
  waitForConnections: true, // File d'attente si toutes les connexions sont occupées
  connectionLimit: 10, // Nombre maximum de connexions simultanées
});

export const DishModel = {
  // 1. Récupérer tous les plats
  async findAll() {
    // extraire uniquement le premier élément du tableau retourné.
    // DESTRCUTURATION
    const [rows] = await pool.execute("SELECT * FROM dish ORDER BY id");
    return rows;
  },
  // 2. Récupérer un plat par son id
  async findById(id) {
    // On cherche le plat dont l'id correspond au paramètre reçu
    // Le ? est remplacé par [id] - mysql2 sécurise la valeur contre les injections SQL
    const [rows] = await pool.execute("SELECT * FROM dish WHERE id = ?", [id]);
    // rows est un tableau - on retourne uniquement le premier résultat (ou null si pas trouvé)
    return rows[0] ?? null;
  },
  // 3. Créer un nouveau plat dans la base de données
  async create(name, price) {
    const [result] = await pool.execute(
      // paramètres préparés pour éviter les injections SQL (=?)
      "INSERT INTO dish (name, price) VALUES (?, ?)",
      [name, parseInt(price)], // parseInt convertit le prix en entier (les formulaires HTML envoient des strings)
    );
    // insertId = l'id auto-généré par MySQL pour le nouveau plat
    return result.insertId;
  },
  // Modifie un plat existant dans la base de données
  async update(id, name, price) {
    const [result] = await pool.execute(
      // SET avant WHERE - ordre obligatoire en SQL dans l'ordre : name, price, id
      "UPDATE dish SET name = ?, price = ? WHERE id = ?",
      [name, parseInt(price), id], // tableau dans le même ordre que les ? de la requête
    );
    // affectedRows > 0 = true si le plat a bien été modifié, false sinon
    return result.affectedRows > 0;
  },

  // 5. Supprimer un plat
  async delete(id) {
    const [result] = await pool.execute("DELETE FROM dish WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },
};
