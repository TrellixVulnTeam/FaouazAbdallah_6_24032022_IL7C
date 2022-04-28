// Import du package http - https requiert un certificat SSL à obtenir avec un nom de domaine
const http = require('http');//https  // Connecte un utilisateur
// Import de app pour utilisation de l'application sur le serveur
const app = require('./app');

// on dit sur quel port expresse doit tourner 
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);



// Le serveur écoute le port 
server.listen(process.env.PORT || 3000);