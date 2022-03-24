const express = require('express');// Importation d'express => Framework basé sur node.js
// Pour gérer la demande POST provenant de l'application front-end, nous devrons être capables d'extraire l'objet JSON de la demande, on importe donc body-parser

// Création d'une application express
const app = express(); // L'application utilise le framework express

app.use(express.json());// Pour gérer la requête POST venant de l'application front-end on a besoin d'en extraire le corps JSON. Pour cela, vous avez juste besoin d'un middleware très simple
//  body.parcer est la methode ancienne de  app.use(express.json());
// On importe mongoose pour pouvoir utiliser la base de données
const mongoose = require('mongoose'); // Plugin Mongoose pour se connecter à la data base Mongo Db

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');


// Connection à la base de données MongoDB avec la sécurité vers le fichier .env pour cacher le mot de passe
// L'un des avantages que nous avons à utiliser Mongoose pour gérer notre base de données MongoDB est que nous pouvons implémenter des schémas de données stricts
// qui permettent de rendre notre application plus robuste
mongoose.connect('mongodb+srv://faouaz:mongoBD15@cluster0.947h4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  // on autorise ce serveur à fournir des scripts pour la page visitée
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});



// toutes la logique app.get app.post .... est exporteé dans le fichier route et importé ici a travers stuffRoutes 
app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes);


module.exports = app;

//npm start 