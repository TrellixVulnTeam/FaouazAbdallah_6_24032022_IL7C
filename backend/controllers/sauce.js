// Récupération du modèle créé grâce à la fonction schéma de mongoose

// Récupération du modèle 'sauce'
const modelSauce = require('../models/Sauce');
// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require('fs');

// Enregistrement des Sauces dans la base de données app.post
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);// le front-end doit envoyer les données de la requete sous  form-date () nous devons donc l'analyser à l'aide de JSON.parse pour obtenir  un objet utilisable.
    delete sauceObject._id;// le front-end envoi egalment un id qui ne sera pas le bon  qu'il faudra supprimer avant la construction de la sauce  
    const sauce = new modelSauce({
        ...sauceObject, //userId : req.body.userId  L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        // pour url de l'image Nous devons également résoudre l'URL complète de notre image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // req.file.filename pour accedez au nom du fichier ,http://localhost:3000/images/<image-name>.jpg
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error })); //error :error 
};

// Mettez à jour une sauce existante app put
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // on crée un objet sauceObject qui regarde si req.file(nouvelle image) existe ou non
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
    modelSauce.findOne({ _id: req.params.id }) //nous utilisons l'ID que nous recevons comme paramètre pour trouver la sauce correspondant dans la base de données 
    .then(sauce => { // on extrait le nom du fichier qu'il faut supprimer
      const filename = sauce.imageUrl.split('/images/')[1];// on veut recuperer le nom du fichier precisement donc 1 = nom du fichier,  nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
      fs.unlink(`images/${filename}`, () => { //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier et comme 2 argument le   le callback  pour supprimer la sauce de la base de données
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

// Permet de "liker"ou "dislaker" une sauce
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
    modelSauce.updateOne({
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
    modelSauce.updateOne( // S'il s'agit d'un dislike
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
    modelSauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
          modelSauce.updateOne({
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
          modelSauce.updateOne({
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


