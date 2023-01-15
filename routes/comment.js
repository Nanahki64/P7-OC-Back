const express = require('express');
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Route qui permet d'envoyer la requête pour créer un commentaire.
 */
router.post('/', auth,commentCtrl.createComment);

/**
 * Route qui permet d'envoyer la requête pour récupérer tout les post.
 */
router.get('/', auth,commentCtrl.getAllComments);

/**
 * Route qui permet d'envoyer la requête pour supprimer un post.
 */
 router.delete('/:id', auth,commentCtrl.deleteComment);

/**
 * Route qui permet d'envoyer la requête pour récupérer un commentaire via son id.
 */
router.get('/:id', auth,commentCtrl.getOneComment);

/**
 * Route qui permet d'envoyer la requête pour récupérer les commentaires d'un post.
 */
router.post('/post', auth,commentCtrl.getPostComments);

module.exports = router;