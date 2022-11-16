const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * exportation de la fonction createComment qui permet de créer un commentaire.
 */
exports.createComment = async (req, res, next) => {
    const comment = await prisma.comment.create({
        data: {
            comment: req.body.comment,
            post: { connect: { id: req.body.id } },
            author: { connect: { email: req.body.email } }
        }
    })
    res.json(comment);
};

/**
 * exportation de la fonction getAllComments qui permet de récupérer tout les commentaires.
 */
exports.getAllComments = async (req, res, next) => {
    const comments = await prisma.comment.findMany({ })
    res.json(comments);
}

/**
 * exportation de la fonction getOneComment qui permet de récupérer un commentaire.
 */
exports.getOneComment = async (req, res, next) => {
    const comment = await prisma.comment.findUnique({
        where: {
            id: req.params.id
        }
    })
    res.json(comment);
}