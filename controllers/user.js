const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

/**
 * exportation de la fonction signup qui permet de créer un utilisateur.
 * bcrypt permet de hacher le mot de passe utilisateur avec un sel.
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                //isAdmin: true,
            }
        })
        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/**
 * exportation de la fonction login qui permet d'authentifier un utilisateur.
 * bcrypt compare les mots de passe haché entre la base de donnée et ce qui à été inscrit dans le formulaire.
 * jwt assigne un token à l'utilisateur.
 */
exports.login = (req, res, next) => {
    prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(user === null) {
            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid) {
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                } else {
                    res.status(200).json({
                        userId: user.id,
                        isAdmin: user.isAdmin,
                        token: jwt.sign(
                            { userId: user.id, isAdmin: user.isAdmin },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: '24h' }
                        )
                    });
                }
            })
            .catch(error => {
                res.status(500).json({ error });
            })
        }
    })
    .catch(error => {
        res.status(500).json({ error });
    })
};