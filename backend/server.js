const http = require('http');//https
const app = require('./app');

// on dit sur quel port expresse doit tourner 
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);



// Le serveur écoute le port 
server.listen(process.env.PORT || 3000);