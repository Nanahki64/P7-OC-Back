const passwordValidator  = require('password-validator');

/**
 * déclaration de schema qui prend plusieurs paramètre pour le contrôle de la validation des mots de passe.
 */
    let schema = new passwordValidator();
    schema
    .is().min(8)
    .has().uppercase(1)
    .has().lowercase()
    .has().digits()
    .is().not().oneOf(['Passw0rd', 'Password123']);

/**
 * Permet d'exporter le module pour l'utiliser dans un autre composant.
 */
module.exports = (req, res, next) => {
    if(schema.validate(req.body.password)) {
        return next();
    } else {
        return res
        .status(400)
        .json({error: `le mot de passe n'est pas assez fort ${schema.validate('req.body.password', {list: true})}`})
    }
};