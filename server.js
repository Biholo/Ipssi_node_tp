// index.js
const express = require('express');
const app = express();
const port = 3000;
const db = require('./database.js')
const bcrypt = require('bcrypt');

let cors = require('cors');

app.use(express.json());
app.use(cors());



// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Get all user
app.get('/user', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.send('Erreur de base de données');
      return;
    }
    console.log(results);
    res.status(200).json(results);
  });
});

//Get user id
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;

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
});

//Post user
app.post('/user', async (req, res) => {
  const { last_name, first_name, email, password } = req.body;

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
      res.status(201).json({ id: userId, message: 'Utilisateur créé avec succès' });
    });
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors du traitement du mot de passe' });
  }
});

//Login
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;

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
      res.status(200).json({ message: 'Connexion réussie', user });
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur lors du traitement de la connexion' });
  }
});

//Delete User
app.delete('/user/:id', (req, res) => {
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
});


//Update User
app.put('/user/:id', async (req, res) => {
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
});

//Post comment
app.post('/comment', async (req, res) => {
  const { content, techno_id, user_id } = req.body;

  if (!content || !techno_id || !user_id ) {
    return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
  }

  try {

    const insertQuery = 'INSERT INTO comment (content, created_at, techno_id, user_id) VALUES (?, NOW(), ?, ?)';
    db.query(insertQuery, [content, techno_id, user_id], (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête :', err);
          return res.status(500).json({ error: 'Erreur de base de données' });
        }

        const commentId = results.insertId;
        console.log(`Commentaire créé avec l'ID : ${commentId}`);
        res.status(201).json({ id: commentId, message: 'Commentaire créé avec succès' });
      });
  
  } catch (error) {
    console.error('Erreur lors de la création du commentaire :', error);
    res.status(500).json({ error: 'Erreur lors du traitement du commentaire' });
  }
});

//Get all comment by techno
app.get('/comment/techno/:id', (req, res) => {
  const technoId = req.params.id;

  const query = 'SELECT * FROM comment WHERE techno_id = ?';

  db.query(query, [technoId], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur de base de données' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: `Commentaire non trouvé`});
      return;
    }

    console.log(results);
    res.status(200).json(results);
  });
});

//Get all comment by user
app.get('/comment/user/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM comment WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur de base de données' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: `Commentaire non trouvé`});
      return;
    }

    console.log(results);
    res.status(200).json(results);
  });
});

//Get comment writer avec :date
app.get('/comment/:date', (req, res) => {
  const targetDate = req.params.date;

  if (!isValidDateFormat(targetDate)) {
    return res.status(400).json({ error: 'Format de date invalide. Utilisez le format YYYY-MM-DD.' });
  }

  const query = 'SELECT * FROM comment WHERE created_at < ?';

  db.query(query, [targetDate], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      return res.status(500).json({ error: 'Erreur de base de données' });
    }

    res.status(200).json(results);
  });
});


function isValidDateFormat(date) {
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateFormatRegex.test(date);
}

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});