// index.js
const express = require('express');
const app = express();
const port = 3000;
const db = require('./database/database.js')

let cors = require('cors');

app.use(express.json());
app.use(cors());

const commentRoute = require('./routes/commentRoute')
const technoRoute = require('./routes/technoRoute')
const userRoute = require('./routes/userRoute')


// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

app.use('/comment', commentRoute)
app.use('/techno', technoRoute)
app.use('/user', userRoute)

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});