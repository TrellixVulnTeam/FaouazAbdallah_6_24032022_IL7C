const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//const MongooseErrors = require( ' mongoose-errors ' )

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//unique:true pour ne pas que plusieurs User utilise la meme adresse mail pour l'inscription
  password: { type: String, required: true }
});
// Applique ce validator au userSchema avant d'en faire un model (pour ne pas avoir des erreurs ilisibles de la part de mongooseDB)
userSchema.plugin(uniqueValidator);

// Ce plugin tire parti des middlewares de gestion des erreurs récemment introduits sur mongoose , il identifie avec succès le chemin (ou le champ) défaillant et la valeur correctement, et les ajoute dans le hachage des erreurs
//userSchema.plugin(MongooseErrors) ;


module.exports = mongoose.model('User',userSchema); 
