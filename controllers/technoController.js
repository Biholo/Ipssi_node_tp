const db = require('../database/database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


// Create Techno
exports.createTechno = async (req, res) => {
    const { name, created_by } = req.body;

    if (!name || !created_by) {
        return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
    }

    try {
        const insertQuery = 'INSERT INTO techno (name, created_by, created_at) VALUES (?, ?, NOW())';
        db.query(insertQuery, [name, created_by], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête :', err);
                return res.status(500).json({ error: 'Erreur de base de données' });
            }

            const technoId = results.insertId;
            console.log(`Techno créée avec l'ID : ${technoId}`);
            res.status(201).json({ id: technoId, message: 'Techno créée avec succès' });
        });

    } catch (error) {
        console.error('Erreur lors de la création de la techno :', error);
        res.status(500).json({ error: 'Erreur lors du traitement de la techno' });
    }
};

// Read Techno by ID
exports.getTechnoById = async (req, res) => {
    const technoId = req.params.id;

    const query = 'SELECT * FROM techno WHERE id = ?';
    db.query(query, [technoId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            res.status(500).json({ error: 'Erreur de base de données' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: `Techno non trouvée` });
            return;
        }

        console.log(results);
        res.status(200).json(results[0]);
    });
};

// Update Techno by ID
exports.updateTechno = async (req, res) => {
    const technoId = req.params.id;
    const { name, created_by } = req.body;

    if (!name || !created_by) {
        return res.status(400).json({ error: 'Tous les champs doivent être remplis' });
    }

    const updateQuery = 'UPDATE techno SET name = ?, created_by = ? WHERE id = ?';
    db.query(updateQuery, [name, created_by, technoId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        res.status(200).json({ message: 'Techno mise à jour avec succès' });
    });
};

// Delete Techno by ID
exports.deleteTechno = async (req, res) => {
    const technoId = req.params.id;

    const deleteQuery = 'DELETE FROM techno WHERE id = ?';
    db.query(deleteQuery, [technoId], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        res.status(200).json({ message: 'Techno supprimée avec succès' });
    });
};

// Get all Technos
exports.getAllTechnos = async (req, res) => {
    const query = 'SELECT * FROM techno';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête :', err);
            return res.status(500).json({ error: 'Erreur de base de données' });
        }

        res.status(200).json(results);
    });
};