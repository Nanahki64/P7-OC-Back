const express = require('express');
const userCtrl = require('../controllers/user');
const validator = require('../middleware/password-validator');
const limiter = require('../middleware/limiter');
const router = express.Router();

/**
 * Routes qui permettent d'envoyer la requête pour s'inscrire ainsi que pour se connecter.
 * validator permet de vérifier la force du mot de passe lors de l'enregistrement de l'utilisateur.
 * limiter permet d'empêcher d'envoyer la requête à l'infinie.
 */
router.post('/signup',validator, userCtrl.signup);
router.post('/login',limiter, userCtrl.login);

/**
 * Permet d'exporter le module pour l'utiliser dans un autre composant.
 */
module.exports = router;