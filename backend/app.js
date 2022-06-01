const express = require('express');// Importation d'express => Framework basé sur node.js
const mongoose = require('mongoose');// Plugin Mongoose pour se connecter à la data base Mongo Db
var mongodbErrorHandler = require('mongoose-mongodb-errors');
const path = require('path');// Il nous faudra une nouvelle importation dans app.js pour accéder au path de notre serveur :  qui donne accés au chemin du systeme de fichier 
const helmet = require('helmet');// utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
const cookieSession = require('cookie-session');
const nocache = require('nocache');
const morgan = require('morgan');

// les routeurs
const sauceRoutes = require('./routes/sauce');// On importe la route dédiée aux sauces
const userRoutes = require('./routes/user');// On importe la route dédiée aux utilisateurs

// utilisation du module 'dotenv'(.env)pour masquer les informations de connexion à la base de données à l'aide de variables d'environnement
require('dotenv').config();

mongoose.connect('mongodb+srv://faouaz:mongoBD15@cluster0.947h4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',//`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_passeword}@${process.env.DB_CLUSTER }.mongodb.net/${process.env.DB_NAME }?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  mongoose.plugin(mongodbErrorHandler);
  
// Création d'une application express
const app = express(); // L'application utilise le framework express

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

// Options pour sécuriser les cookies
const expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); 
app.use(cookieSession({
  name: 'session',
  keys: process.env.key_session,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:3000',
             path: 'foo/bar',
            expires: expiryDate
          }
  })
);

  
  // Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req
  app.use(express.json());
  // On utilise helmet contre les attaques cross-site scripting ou XSS (les failles XSS permettent à un attaquant d’injecter du code JavaScript)
  app.use(helmet({
    crossOriginResourcePolicy: false //empêche Helmet de définir l' Cross-Origin-Embedder-Policy
}));
  // permet de voir les requettes Get ,Post sur le terminal 
   app.use(morgan('tiny'));
  //  on désactive la mise en cache du navigateur côté client .
  app.use(nocache());
  // indique à Express qu'il faut gérer la ressource images de manière statique
  app.use('/images', express.static(path.join(__dirname, 'images'))); 
  // Va servir les routes dédiées aux sauces
  app.use('/api/sauces' ,sauceRoutes);
  // Va servir les routes dédiées aux utilisateurs
  app.use('/api/auth', userRoutes);
  
// Export de l'application express pour déclaration dans server.js
module.exports = app;