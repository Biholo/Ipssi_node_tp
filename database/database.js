const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_ipssi',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

module.exports = db