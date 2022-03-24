//on importe thing ici plus besoin dans le fichier app 
const Sauce = require('../models/sauce');

//il nous faut une nouvelle importation. Il s'agit du package 
//const fs = require('fs');
/*fs signifie « file system » (soit « système de fichiers », en français). 
Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.*/


exports.createSauce  = (req, res, next) => { ///api/stuff' EST LA Route principale qui aura des extention ex :id , 
 
  //Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON
   const sauceObject = JSON.parse(req.body.sauce); //on recupere en forma json le sauce 
   delete sauceObject._id; 
   const sauce = new Sauce({
   ...sauceObject,
   //on genere url de limage 
   //Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.
   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//req.get('host') =pour avoir le localhost 
 })

   sauce.save() //La méthode save() renvoie une Promise. Ainsi, dans notre bloc then()
       .then(() => res.status(201).json({ message: 'Sauce enregistrée!' })) // on envoie un reponse au frontend pour eviter l'expiration de la requete  nous renverrons une réponse de réussite avec un code 201 de réussite.
       .catch(error => res.status(400).json({ error })); // ou  { error : error } Dans notre bloc catch() , nous renverrons une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400.
};

exports.modifySauce = (req, res, next) => {  //on appelle l'objet avec son id 
  //on va utilisé loperateur ternaire qui regarde si req.file existe ou non
  const sauceObject = req.file ? 
  //s'il existe on aura un type d'objet
  {
    ...JSON.parse(req.body.sauce),//on recupere toutes les informations de la requet
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//ensuite on va genere limage url puisque c'est une nouvelle image
  }/*sinon s'il n'existe pas on fait simplement une copie de req.body*/  : { ...req.body };
  // la méthode updateOne()  pour modifier lobjet   
   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//req.body changé en thingObject
      //_id: req.params.id  le _id = id dans les parametres de requet ,
      // ...req.body, _id: req.params.id pour refaire un objet thing selon les modification  et dire que _id = id dans les parametres de requet 
      .then(() => res.status(200).json({ message: 'Objet modifié !' })) //pour la confirmation attendu pour le frontend 
      .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
 //on veut le id celui qu'il ya dans les parametre de la requet 
  Sauce.findOne({ _id: req.params.id })// on va dabord trouvé lobjet dans la base de donnée 
  .then(sauce => { //on recupere un thing 
      //ensuite on extrait le nom du fichier a supprimé 
      const filename = sauce.imageUrl.split('/images/')[1];// 1ere element est avant /image et 2eme element est apres image donc le nom du fichier , nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
      //nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier grace au nom du fichier extrait , en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
      fs.unlink(`images/${filename}`, () => {// ensuite dans le callbak on fait la suppression de lobjet dans la base 
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
  
  
};

exports.getOneSauce = (req, res, next) => {  // nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre ;
  Sauce.findOne({ _id: req.params.id }) //nous utilisons ensuite la méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête ;
      .then(sauce => res.status(200).json(sauce)) //ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
      .catch(error => res.status(404).json({ error }));

};

exports.getAllSauce  = (req, res, next) => {/*ou app.use */
  Sauce.find()//nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things dans notre base de données
      .then(sauces => res.status(200).json(sauces)) //promise ,ici things pour recuperer le tableau contenant tous les Things dans notre base de données
      .catch(error => res.status(400).json({ error }));

};

