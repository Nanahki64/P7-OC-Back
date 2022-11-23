const express = require('express');
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Route qui permet d'envoyer la requête pour créer un post.
 * postCtrl contrôle la création d'un post.
 */
router.post('/',auth, postCtrl.createPost);

/**
 * Route qui permet de modifier un post.
 * postCtrl contrôle la modification d'un post.
 */
router.put('/:id', auth, postCtrl.modifyPost);

/**
 * Route qui permet d'envoyer la requête pour récupérer tout les post.
 * postCtrl contrôle la récupération des post.
 */
router.get('/',auth, postCtrl.getAllPosts);

/**
 * Route qui permet d'envoyer la requête pour récupérer un post via son id.
 * postCtrl contrôle la récupération du post.
 */
router.get('/:id',auth, postCtrl.getOnePost);

module.exports = router;