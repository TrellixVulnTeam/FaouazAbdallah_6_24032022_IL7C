
const modelSauce = require('../models/Sauce');

// Enregistrement des Sauces dans la base de données
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject;
    const sauce = new modelSauce({
        ...sauceObject,
        // pour url de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

// Mettez à jour une sauce existant
exports.modifySauce = (req, res, next) => {
    modelSauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
}

// Suppression d'une sauce   
exports.deleteSauce = (req, res, next) => {
    modelSauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error }));
}

// Récupération d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {
    modelSauce.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
}

// Récupération de la liste de sauces en vente
exports.getAllSauce = (req, res, next) => {
    modelSauce.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }));
}

