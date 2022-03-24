const express = require('express');
const router = express.Router();
//on appelle au controllers pour associer les 2 fonctions au differentes routes
const userCtrl = require('../controllers/user');

//des routes post puisque le font end envoie des informations 
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

// N'oubliez pas que le segment de route indiqué ici est uniquement le segment final, 
// car le reste de l'adresse de la route sera déclaré dans notre application Express.