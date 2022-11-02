const multer = require('multer');

/**
 * déclaration des types et extensions de fichiers téléchargé.
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/**
 * configuration du chemin et du nom pour les fichiers téléchargé.
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

/**
 * Permet d'exporter le module pour l'utiliser dans un autre composant.
 */
module.exports = multer({ storage }).single('image');