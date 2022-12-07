const express = require('express');
const likesCtrl = require('../controllers/likes');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * 
 */
router.post('/', auth, likesCtrl.createLike);

module.exports = router;