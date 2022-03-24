
/*const mongoose = require('mongoose');

//Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, nous installerons un package de validation pour prévalider les informations avant de les enregistrer :
//// mongoose-unique-validator  améliore les messages d'erreur lors de l'enregistrement de données uniques.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//Pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail, nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
  password: { type: String, required: true }
});

// Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, nous installerons un package de validation pour prévalider les informations avant de les enregistrer :
 userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);*/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//unique:true pour ne pas que plusieurs user utilise la meme adresse mail pour linscription
  password: { type: String, required: true }
});
// prévalider les informations avant de les enregistrer 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);


// Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, nous installerons un package de validation pour 
// prévalider les informations avant de les enregistrer :

// mongoose-unique-validator  améliore les messages d'erreur lors de l'enregistrement de données uniques.
