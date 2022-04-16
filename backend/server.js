const http = require('http');
const app = require('./app');

// on dit sur quel port expresse doit tourner 
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);