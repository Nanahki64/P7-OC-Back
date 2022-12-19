const express = require('express');
const likesCtrl = require('../controllers/likes');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Crée ou met un jour un like.
 */
router.post('/', auth, likesCtrl.createOrUpdate);

/**
 * Supprime le like d'un utilisateur.
 */
router.delete('/', auth, likesCtrl.deleteLike);

/**
 * Récupère le nombre de like d'un post.
 */
router.get('/:id', auth, likesCtrl.getLikesCount);

module.exports = router;