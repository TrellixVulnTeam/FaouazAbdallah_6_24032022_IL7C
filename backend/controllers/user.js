// apres installtion de bcrypt on l'appelle 
const bcrypt = require('bcrypt');
// apres npm install jsonwebtoken  Pour pouvoir créer et vérifier les tokens d'authentification   
const jwt = require('jsonwebtoken');


//je fais appele de mon models user dont jai besoin 
const User = require('../models/user');


//pour l'enregistrement de nouveau utilisateur
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois.donc on fera 10 tours de hashage  qui sera suffissant pour securiser le code 
  //on va recureper le mots de passe avec le hashage   il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
  .then(hash => {
      const user = new User({ // on va crée le nouvel utilisateur 
        email: req.body.email,// on fournir ladresse fournit  dans le corps de la requette 
        password: hash // ON va utilisé comme mots de passe le hash crypté qui est crée juste avant 
      });
      user.save()// on utilise la methode save pour enregistré les données dans la base de donnée
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(401).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// pour connecter les utilisateurs exitants
exports.login = (req, res, next) => {
  
    User.findOne({ email: req.body.email })//la methode findOne pour trouver un seul utilisateur  et le email: correspond au mail de la requet fontend = req.body.email  
    .then(user => {
      if (!user) { // si on ne trouve pas de user dans la base de donnée
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      } //sinon si utilisateur trouvée 
      bcrypt.compare(req.body.password, user.password) //compare pour comparer le req.body.password (frontend ) au  user.password ( le hash) de la base de donnée
        .then(valid => {
          if (!valid) { //apres avoir trouver le user si la comparaison retourne false 
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }//et si la comparaison retourne true l'utilisateur entre des identifiant valable 
          res.status(200).json({
           //on lui envoi :
            userId: user._id,
            // on remplace token: 'TOKEN' qui est generé automatiquement par une function sign avec 3 arguments
            token: jwt.sign( // sign prend les données que l'on veut encoder 
                { userId: user._id }, // 1ere argument le userId qui doit correspondre 
                'RANDOM_TOKEN_SECRET', //le 2eme argument c'est la clée secret d'encodage 
                { expiresIn: '24h' } //le 3eme argument est argument de configuration ,le token ne durera que 24h 
              ) 
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));


};
