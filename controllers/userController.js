const db = require('../database/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.getAllClient = async(req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête :', err);
          res.send('Erreur de base de données');
          return;
        }
        res.status(200).json(results);
    });
}

exports.getUserById = async(req, res) => {
    const userId = req.params.id
    const query = 'SELECT * FROM user WHERE id = ?';
    db.query(query, [userId], (err, results) => {
    if (err) {
        console.error('Erreur lors de l\'exécution de la requête :', err);
        res.status(500).json({ error: 'Erreur de base de données' });
        return;
    }

    if (results.length === 0) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    const user = results[0];
    console.log(user);
    res.status(200).json(user);
    });
}

exports.deleteUser= async(req, res) => {
    const userId = req.params.id;

    const query = 'DELETE FROM user WHERE id = ?';

    db.query(query, [userId], (err, results) => {
    if (err) {
        console.error('Erreur lors de l\'exécution de la requête :', err);
        res.status(500).json({ error: 'Erreur de base de données' });
        return;
    }

    if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
        return;
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    });
}

exports.updateUser= async(req, res) => {
    const userId = req.params.id;
    const { last_name, first_name, email, password } = req.body;

    if (!last_name || !first_name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
    }

    try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'UPDATE user SET last_name = ?, first_name = ?, email = ?, password = ? WHERE id = ?';

    db.query(query, [last_name, first_name, email, hashedPassword, userId], (err, results) => {
        if (err) {
        console.error('Erreur lors de l\'exécution de la requête :', err);
        return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    });
    } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors du traitement du mot de passe' });
    }
}


exports.register = async (req, res) => {
    const { last_name, first_name, email, password } = req.body;
    console.log('register:');
    console.log(last_name, first_name, email, password);
    if (!last_name || !first_name || !email || !password) {
        return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
    }

    try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO user (last_name, first_name, email, password) VALUES (?, ?, ?, ?)';

    db.query(query, [last_name, first_name, email, hashedPassword], (err, results) => {
        if (err) {
        console.error('Erreur lors de l\'exécution de la requête :', err);
        return res.status(500).json({ error: 'Erreur de base de données' });
        }

        const userId = results.insertId;
        console.log(`Utilisateur créé avec l'ID : ${userId}`);
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ id: userId, message: 'Utilisateur créé avec succès', token });
    });
    } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors du traitement du mot de passe' });
    }
}

exports.login = async(req, res) => {
    const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe' });
  }

  try {
    const userQuery = 'SELECT * FROM user WHERE email = ?';
    db.query(userQuery, [email], async (err, results) => {
      if (err) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', err);
        return res.status(500).json({ error: 'Erreur de base de données' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token, user });
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur lors du traitement de la connexion' });
  }
}

