const express = require('express');
const postCtrl = require('../controllers/post');
const router = express.Router();

/**
 * Route qui permet d'envoyer la requête pour créer un post.
 * postCtrl contrôle la création d'un post.
 */
router.post('/', postCtrl.createPost);

/**
 * Route qui permet d'envoyer la requête pour récupérer tout les post.
 * postCtrl contrôle la récupération des post.
 */
router.get('/', postCtrl.getAllPosts);

module.exports = router;