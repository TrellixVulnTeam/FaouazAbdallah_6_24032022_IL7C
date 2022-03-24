const mongoose = require('mongoose');

/*const thingSchema = mongoose.Schema({  // la fonction Schema pour construire un objet
  //_id: 'oeihfzeoi'r Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose,
  title: { type: String, required: true }, 
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});
//ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Thing », le rendant par là même disponible pour notre application Express.
module.exports = mongoose.model('Thing', thingSchema);//things =truc comme 1 argument , le 2 eme le nom de lobjet thingSchema*/

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});
module.exports = mongoose.model('Sauce', sauceSchema);