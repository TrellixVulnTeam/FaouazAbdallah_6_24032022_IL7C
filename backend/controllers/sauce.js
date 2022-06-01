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

// Mettez à jour une sauce existante app put.
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
    modelSauce.findOne({ _id: req.params.id })//_id de la sauce en vente (dans la base) : egale  a celui du  paramètre de la requête /api/stuff/:id 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Récupération de la liste de sauces en vente app.get
exports.getAllSauce = (req, res, next) => {
    modelSauce.find() // la base envoie la liste des sauces 
        .then(sauces => res.status(200).json(sauces))// on envoi simplement le tableau des sauces de la base
        .catch(error => res.status(400).json({ error }));
};

// Permet de "liker"ou "dislaker" une sauce
exports.likeDislike = (req, res, next) => {
            // Like présent dans le body
            let like = req.body.like
            console.log(req.body);
        
            modelSauce
                .findOne({ _id: req.params.id })
                .then((sauce) => {
                    
                    //Si l'utilisateur n'est pas dans le tableau des likes et s'il n'est non plus dans le tableau des diskiles 
                    let check = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId);
                    if(check) {
                       
                        //donc on doit vérifier s'il veut liker ou pas
                        switch (like) {
                            case 1: //Il veut liker
                            modelSauce.updateOne({ _id: req.params.id }, {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId },
                                 _id: req.params.id
                            })
                            .then(() => {
                                res.status(201).json({ message: "Like pris en compte" });
                            })
                            .catch((error) => {
                                res.status(400).json({ error })
                            });
                                break;
                            case -1: // Il veut disliker
                            modelSauce.updateOne({ _id: req.params.id },
                                {
                                    $inc: { dislikes: 1 },
                                    $push: { usersDisliked: req.body.userId },
                                    _id: req.params.id
                                })
                                .then(() => {
                                    res.status(201).json({ message: "Dislike pris en compte" });
                                })
                                .catch((error) => {
                                    res.status(400).json({ error });
                                })
                                break;
                            default:
                                return res.status(400).json({
                                    message: "Comment voulez-vous annuler une action que vous n'avez pas faite !?"
                                });
                        }
                    } else {
                        
                        if(like === 0) {
                            modelSauce.findOne({ _id: req.params.id })
                            .then((sauce) => {
                                if (sauce.usersLiked.includes(req.body.userId)) {
                                   modelSauce.updateOne({ _id: req.params.id },
                                        {
                                            $inc: { likes: -1 },
                                            $pull: { usersLiked: req.body.userId }, 
                                        })
                                        .then(() => {
                                            res.status(201).json({ message: "Suppression like" });
                                        })
                                        .catch((error) => {
                                            res.status(400).json({ error });
                                        });
                                }
                                if (sauce.usersDisliked.includes(req.body.userId)) {
                                   modelSauce.updateOne({ _id: req.params.id },
                                        {
                                            $inc: { dislikes: -1 },
                                            $pull: { usersDisliked: req.body.userId },
                                        })
                                        .then(() => {
                                            res.status(201).json({ message: "Suppression dislike" });
                                        })
                                        .catch((error) => {
                                            res.status(404).json({ error });
                                        });
                                }
                            })
                            .catch((error) => res.status(404).json({ error }))
                        }
                        else {
                            
                            res.status(400).json({ message: "Impossible de liker ou de disliker plus d'une fois !" });
                        }
                    }
                }).catch((error) => res.status(404).json({error: error}))
        }