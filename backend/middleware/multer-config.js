// nous utiliserons multer , un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({ //la méthode diskStorage()  configure le chemin et le nom de fichier pour les fichiers entrants.
  destination: (req, file, callback) => {  // 1) la destination pour indiquer dans quel dossier enregistrer les fichiers
   callback(null, 'images'); // null = pour dire qu'il ny pas derreur  , images = le nom du dossier images creer dans le  backend
  },
  filename: (req, file, callback) => { //2) filename pour indiquer quel nom de fichier utilisé
    const name = file.originalname.split(' ').join('_'); // on genere le nouveau nom du fichier ,split et join pour regler le probleme des espaces en les remplacant par  des underscores
    const extension = MIME_TYPES[file.mimetype]; //on utilise le MIME_TYPES pour generer l'extension du fichier  MIME_TYPES = correpond au mimetype envoyé par le frontend
    callback(null, name + Date.now() + '.' + extension); // on va creer le file name entier avec un date pour le rendre le plus unique possible  doonc le nom la date et l'extension
  }
});

module.exports = multer({storage}).single('image');//single pour indiquer que c'est un fichier unique et qu'il sagit de fichier image uniquement