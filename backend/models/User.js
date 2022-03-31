const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//unique:true pour ne pas que plusieurs User utilise la meme adresse mail pour l'inscription
  password: { type: String, required: true }
});
// prévalider les informations avant de les enregistrer (pour ne pas avoir des erreurs ilisibles de la part de mongooseDB)
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); //User.js 
