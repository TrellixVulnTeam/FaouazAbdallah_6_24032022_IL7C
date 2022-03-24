const http = require('http'); //  pour faire un requette http permet de faire appelle a http.createServer(app);
const app = require('./app'); // la meme syntaxe que const http mais cette fois ci pour importer le module.exports = app du fichier server.js
app.set('port',process.env.PORT || 3000); //on doit definir avant sur quelle port la requette expresse va tournée
// const server = http.createServer((req, res) => { //on appel la function 
//     res.end('ALLAH Akbar!');
// });

// la meme syntaxe  pour app(application) dans le dossier app.js
const server = http.createServer(app); 
server.listen(process.env.PORT || 3000); // le port 3000 est utilisé par defaut mais n'est pas toujours libre donc on utilise un port environnement process.env.PORT