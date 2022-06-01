
// apres installtion de bcrypt on l'appelle pour hasher le mots de passe 
const bcrypt = require('bcrypt');
// apres npm install jsonwebtoken  Pour pouvoir créer et vérifier les tokens d'authentification   
const jwt = require('jsonwebtoken');


//je fais appele de mon models user dont jai besoin 
const User = require('../models/User');


//pour l'enregistrement de nouveau utilisateur
exports.signup = (req, res, next) => {
  // console.log(req.body.email) 
  // console.log(req.body.password)
  bcrypt.hash(req.body.password, 10) //nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois.donc on fera 10 tours de hashage  qui sera suffissant pour securiser le code 
  //on va recureper le mots de passe avec le hashage   il s'agit d'une fonction asynchrone qui renvoie une Promise dans laquelle nous recevons le hash généré ;
  .then(hash => {
      const user = new User({ // on va crée un nouveau  utilisateur 
        email: req.body.email,// on va  fournir ladresse passé  dans le corps de la requette 
        password: hash // pour ne pas stoker le mots de passe en blanc (req.body.password)  on va utilisé comme mots de passe le hash crypté qui est crée juste avant 
      });
    // console.log(user)
      user.save()// on utilise la methode save pour enregistré les données dans la base de donnée
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error =>{
          res.statusMessage = "Cette adresse e-mail est déjà utilisée"  //error.message
          res.status(400).end()
        } );
    })
    .catch(error => res.status(500).json({ error }));
};

// pour connecter les utilisateurs exitants
exports.login = (req, res, next) => {
  // nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données :
    User.findOne({ email: req.body.email })//la methode findOne pour trouver un seul utilisateur  donc le email(utilisateur) : doit correspondre  au email de la requet fontend = req.body.email  
    .then(user => {
      if (!user) { // si on ne trouve pas de user dans la base de donnée
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      } //sinon si utilisateur trouvé on vérifie un mot de passe entré par l'utilisateur correspond à un hash sécurisé enregistré en base de données
      bcrypt.compare(req.body.password, user.password) //compare pour comparer le req.body.password  de la requet(frontend ) au  user.password ( le hash) de la base de donnée
        .then(valid => {
          if (!valid) { //apres avoir trouver le user si la comparaison retourne false 
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }//et si la comparaison retourne true l'utilisateur entre des identifiant valable 
          res.status(200).json({
           //on lui envoi :
            userId: user._id, // indentifiant de l'utilisateur dans la base 
            // nous utilisons la fonction sign ( 3 arguments) de jsonwebtoken pour encoder un nouveau token d'authentification   (token utilisateur = token server )
            token: jwt.sign( // sign prend les données que l'on veut encoder 
                { userId: user._id }, // 1ere argument ce token contient l'ID de l'utilisateur (les données encodées dans le token) ,on encode le userId pour la creation de nouveaux objets qui pourront etre supprimer que par le meme utilisateur 
                'RANDOM_TOKEN_SECRET', //le 2eme argument c'est la clée secret d'encodage 
                { expiresIn: '24h' } //le 3eme argument est argument de configuration ,le token ne durera que 24h 
              ) 
          });
        })
        .catch(error => res.status(500).json({ error })); // si l'utilisateur est trouvé mais s'il ya un problème de connexion 
    })
    .catch(error => res.status(500).json({ error }));// si l'utilisateur n'est pas trouvé


};
