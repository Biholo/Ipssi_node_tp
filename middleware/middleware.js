const db = require("../database/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getEmailFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded.email;
  } catch (error) {
    return null;
  }
};

exports.authenticator = (req, res, next) => {
  const token = req.params.token || req.headers.authorization;
  if (!token) {
    return res.status(401).json({ erreur: "Accès refusé, aucun token fourni." });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ erreur: "Accès refusé, token invalide." });
  }
};

exports.isAdmin = async (req, res, next) => {
  const token = req.query.token || req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Access refusé." });

  const email = getEmailFromToken(token);

  if (!email) {
    return res.status(401).json({ error: "Token invalide" });
  }

  db.query(
    "SELECT role from user where email = ?",
    email,
    (error, result) => {
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      }
        
      try {
        if (result[0].role === 'admin') {
          next();
        } else {
          res.status(403).json({ erreur: "Accès refusé" });
        }
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );
};
  
exports.isReporterOrAdmin = async (req, res, next) => {
    const token = req.query.token || req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Access refusé." });
  
    const email = getEmailFromToken(token);
  
    if (!email) {
      return res.status(401).json({ error: "Token invalide" });
    }
};