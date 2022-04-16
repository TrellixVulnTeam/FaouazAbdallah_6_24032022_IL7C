const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

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