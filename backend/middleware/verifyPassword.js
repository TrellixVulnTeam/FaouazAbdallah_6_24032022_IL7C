
const passwordSchema = require('../models/password');


// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
        
        
    } else {
        res.statusMessage = `le mot de pass n'est pas assez fort ${passwordSchema.validate(req.body.password, { list: true })}`
        return res.status(400).end()
        
    }
};
