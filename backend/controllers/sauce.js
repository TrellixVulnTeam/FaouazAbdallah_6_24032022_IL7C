
const modelSauce = require('../models/Sauce');
// Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.
const fs = require('fs');


// Enregistrement des Sauces dans la base de données app.post
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;// le front-end envoi egalment un id qui ne sera pas le bon  qu'il faudra supprimer avant la construction de la sauce  
    const sauce = new modelSauce({
        ...sauceObject, //userId : req.body.userId  L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        // pour url de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error })); //error :error 
};

// Mettez à jour une sauce existant app put
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    //si req.fille existe on traite la nouvelle image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     }
    // s'il n'existe pas, on traite simplement l'objet entrant
     : { ...req.body };
    
    modelSauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce app.delete  
exports.deleteSauce = (req, res, next) => {
    modelSauce.findOne({ _id: req.params.id }) //req.params.id est l'id des parametres de routes 
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        modelSauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
    
};

// Récupération d'une sauce spécifique app.get
exports.getOneSauce = (req, res, next) => {
    modelSauce.findOne({ _id: req.params.id })//_id de la sauce en vente : egale  a celui du  paramètre de la requête /api/stuff/:id 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de la liste de sauces en vente app.get
exports.getAllSauce = (req, res, next) => {
    modelSauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.likeDislike = (req,res,next) => {
// Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like
  // On prend le userID
  let userId = req.body.userId
  // On prend l'id de la sauce
  let sauceId = req.params.id
  console.log(req.body);

  if (like === 1) { // Si il s'agit d'un like
    Sauce.updateOne({
        _id: sauceId
      }, {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        }, // On incrémente de 1
      })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    Sauce.updateOne( // S'il s'agit d'un dislike
        {
          _id: sauceId
        }, {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, // On incrémente de 1
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
          Sauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }

}


exports.testlikeDislike = (req,res,next) => {

  switch (req.body.like) // je recupere le choix de lutilisateur -1, 1 ou 0
  {
    //  pour le choix 1 
    case 1:
      // je recupere la cle _id et sa valeur pour travailler dessu
      saucesModel.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 }, // j'incremente ma cle likes de 1 
        $push: { usersLiked: req.body.userId },// je rajoute l'ID de mon utilisateur dans le tableau
      })
        .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
        .catch((err) => { res.status(400).json({ err }); });
      break;
      case 0:
        saucesModel.findOne({ _id: req.params.id }) // je recherche dans la Database la sauce avec l'ID recuperer dans les parametre de la requette ( dans URL)
          .then((objet) => { // une foi trouver je recupere une promise avec tout l'objet 
  
  
            // je parcour les ID qui sont dans usersLiked 
            // si sa match avec le userId de l'actuel utilisateur j'execute le code
            if (objet.usersLiked.find(user => user === req.body.userId)) {
              saucesModel.updateOne({ _id: req.params.id }, {  // mise a jours de la sauce avec l'ID recuperer dans les parametre
                $inc: { likes: -1 }, // j'enleve 1 au like 
                $pull: { usersLiked: req.body.userId }, // et j'enleve mon Id de usersLiked
              })
                .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                .catch((err) => { res.status(400).json({ err }); });
  
            } if (objet.usersDisliked.find(user => user === req.body.userId)) {
              saucesModel.updateOne({ _id: req.params.id }, {  // mise a jours de la sauce avec l'ID recuperer dans les parametre
                $inc: { dislikes: -1 }, // j'enleve 1 au dislike 
                $pull: { usersDisliked: req.body.userId }, // et j'enleve mon Id de usersdisliked
              })
                .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                .catch((err) => { res.status(400).json({ err }); });
  
            }
          })
          .catch((err) => { res.status(404).json({ err }); });
        break;
        case -1:
      // je recupere la cle _id et sa valeur pour travailler dessu
      saucesModel.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 }, // j'incremente ma cle dislikes de 1 
        $push: { usersDisliked: req.body.userId },// je rajoute l'ID de mon utilisateur dans le tableau dislikes
      })
        .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
        .catch((err) => { res.status(400).json({ err }); });
      break;
    default:
      console.log('j\'ai un probleme');
    }
  



}