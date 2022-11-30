const express = require('express');
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Route qui permet d'envoyer la requête pour créer un commentaire.
 * commentCtrl contrôle la création d'un commentaire.
 */
router.post('/', auth,commentCtrl.createComment);

/**
 * Route qui permet d'envoyer la requête pour récupérer tout les post.
 * commentCtrl contrôle la récupération des commentaires.
 */
router.get('/', auth,commentCtrl.getAllComments);

/**
 * Route qui permet d'envoyer la requête pour supprimer un post.
 * commentCtrl contrôle la récupération des commentaires.
 */
 router.delete('/:id', auth,commentCtrl.deleteComment);

/**
 * Route qui permet d'envoyer la requête pour récupérer un commentaire via son id.
 * commentCtrl contrôle la récupération du post.
 */
router.get('/:id', auth,commentCtrl.getOneComment);

module.exports = router;