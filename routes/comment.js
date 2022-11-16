const express = require('express');
const commentCtrl = require('../controllers/comment');
const router = express.Router();

/**
 * Route qui permet d'envoyer la requête pour créer un commentaire.
 * commentCtrl contrôle la création d'un commentaire.
 */
router.post('/', commentCtrl.createComment);

/**
 * Route qui permet d'envoyer la requête pour récupérer tout les post.
 * commentCtrl contrôle la récupération des commentaires.
 */
router.get('/', commentCtrl.getAllComments);

/**
 * Route qui permet d'envoyer la requête pour récupérer un commentaire via son id.
 * commentCtrl contrôle la récupération du post.
 */
router.get('/:id', commentCtrl.getOneComment);

module.exports = router;