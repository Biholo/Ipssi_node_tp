const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_ipssi',
  });

module.exports = db