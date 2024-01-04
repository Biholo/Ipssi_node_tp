const db = require('../database/database')
const jwt = require('jsonwebtoken')
require('dotenv').config()


function isValidDateFormat(date) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(date);
  }
  
exports.createComment = async(req, res) => {
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
};
  
//Get all comment by techno
exports.getCommentByTechnoId = async(req, res) => {
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
};

//Get all comment by user
exports.getCommentByUserId = async(req, res) => {
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
};

//Get comment writer avec :date
exports.getCommentAfterDate = async(req, res) => {

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
};

// Update comment by comment ID
exports.updateComment = async (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Le champ content doit être rempli' });
    }

    const updateQuery = 'UPDATE comment SET content = ? WHERE id = ?';
    db.query(updateQuery, [content, commentId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        res.status(200).json({ message: 'Commentaire mis à jour avec succès' });
    });
};

// Delete comment by comment ID
exports.deleteComment = async (req, res) => {
    const commentId = req.params.id;

    const deleteQuery = 'DELETE FROM comment WHERE id = ?';
    db.query(deleteQuery, [commentId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        res.status(200).json({ message: 'Commentaire supprimé avec succès' });
    });
};

// Get all comments
exports.getAllComments = async (req, res) => {
    const query = 'SELECT * FROM comment';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        res.status(200).json(results);
    });
};