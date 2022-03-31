const express = require('express');

const router = express.Router();

const saucesCtrl = require('../controllers/sauce');

// Enregistrement des Sauces dans la base de données
router.post('/', saucesCtrl.createSauce);

// Mettez à jour une sauce existant
router.put('/:id', saucesCtrl.modifySauce);

// Suppression d'une sauce 
router.delete('/:id', saucesCtrl.deleteSauce);

// Récupération d'une sauce spécifique
router.get('/:id', saucesCtrl.getOneSauce);

// Récupération de la liste de sauces en vente
router.get('/', saucesCtrl.getAllSauce);



module.exports = router;