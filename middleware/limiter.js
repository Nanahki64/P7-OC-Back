const rateLimit = require('express-rate-limit');

/**
 * déclaration de limiter qui prend plusieurs paramètres pour le contrôle d'envoie de requêtes.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 *1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Permet d'exporter le module pour l'utiliser dans un autre composant.
 */
module.exports = limiter;