// On a besoin d'Express
const express = require('express');
// On crée un router avec la méthode mise à disposition par Express
const router = express.Router();
// On associe les fonctions aux différentes routes, on importe le controller
const userCtrl = require('../controllers/user');
// Crée un nouvel utilisateur
router.post('/signup', userCtrl.signup);
// Connecte un utilisateur
router.post('/login', userCtrl.login);


module.exports = router;