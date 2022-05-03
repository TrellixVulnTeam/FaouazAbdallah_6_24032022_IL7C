// Ajout de plugin externe nécessaire pour utiliser le router d'Express
const express = require('express');
// Appel du routeur avec la méthode mise à disposition par Express
const router = express.Router();
// On importe le middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//On importe le middleware multer pour la gestion des images
const multer = require('../middleware/multer-config');
// On associe les fonctions aux différentes routes, on importe le controller
const saucesCtrl = require('../controllers/sauce');


// Enregistrement des Sauces dans la base de données
router.post('/',auth,multer,saucesCtrl.createSauce);

// Mettez à jour une sauce existant
router.put('/:id',auth,multer,saucesCtrl.modifySauce);

// Suppression d'une sauce 
router.delete('/:id',auth,saucesCtrl.deleteSauce);

// Récupération d'une sauce spécifique
router.get('/:id',auth,saucesCtrl.getOneSauce);

// Récupération de la liste de sauces en vente
router.get('/',auth,saucesCtrl.getAllSauce);

// Route qui permet de gérer les likes des sauces
router.post('/:id/like', auth, saucesCtrl.likeDislike);




module.exports = router;