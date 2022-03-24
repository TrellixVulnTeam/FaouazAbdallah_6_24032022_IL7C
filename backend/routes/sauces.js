const express = require ('express');// on a besoin d'expresse

const router = express.Router();// on crée on routeur avec la methode routeur 

//on importe stuffCtrl  pour les fonction 
const saucesCtrl = require('../controllers/sauce');
/*const auth = require('../middleware/auth'); // on ajoute ce auth sur les coute que l'on veut proteger (authentification)
const multer = require('../middleware/multer-config');
*/


// on appele juste les  functions du controllers on ne l'es applique pas    
router.post('/', saucesCtrl.createSauce);//router.post('/', auth, saucesCtrl.createThing); ne fonction pas 
router.put('/:id', saucesCtrl.modifySauce);
router.delete('/:id', saucesCtrl.deleteSauce);
router.get('/:id', saucesCtrl.getOneSauce);
router.get('/', saucesCtrl.getAllSauce);

module.exports = router;

