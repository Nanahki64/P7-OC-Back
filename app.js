const express = require('express');
const app = express();
const helmet = require('helmet');
const path = require('path');

/**
 * importe les routes user.
 */
const userRoutes = require('./routes/user');

/**
 * utilisation d'express pour analyser les requêtes JSON entrantes.
 */
app.use(express.json());

/**
 * sécurisation des en-têtes HTTP.
 */
app.use(helmet({
  crossOriginResourcePolicy: false, 
}));

/**
 * analyse les réponses et ajoute les en-têtes CORS.
 */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/**
 * utilisation du middleware userRoutes pour chaques requêtes du chemin déclaré.
 */
 app.use('/api/auth', userRoutes);

/**
 * déclaration du chemin qui stock les images téléchargé par les utilisateurs.
 */
app.use('/images', express.static(path.join(__dirname, 'images')));

/**
 * Permet d'exporter le module pour l'utiliser dans un autre composant.
 */
module.exports = app;
