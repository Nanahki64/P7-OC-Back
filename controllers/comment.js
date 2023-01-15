const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
* exportation de la fonction createComment qui permet de créer un commentaire.
*/
exports.createComment = async (req, res, next) => {
    try {
        const comment = await prisma.comment.create({
            data: {
                comment: req.body.comment,
                post: { connect: { id: req.body.id } },
                author: { connect: { id: req.auth.userId } }
            }
        })
        res.json(comment);
    } catch(e) {
        res.status(400).json({ message: `createComment failed:` });
    }
};

/**
* exportation de la fonction deleteComment qui permet de supprimer un commentaire.
*/
exports.deleteComment = (req, res, next) => {
    const commentId = req.params.id;
    const isAdmin = req.auth.isAdmin;
    const isAuthor = req.auth.userId;
    
    prisma.comment.findUnique({
        where: { id: commentId },
    })
    .then((comment) => {
        if(isAdmin || (isAuthor == comment.authorId)) {
            prisma.comment.delete({
                where: { id: commentId }
            })
            .then(() => res.status(200).json({ message: 'Commentaire supprimé.' }))
            .catch(() => res.status(400).json({ message: 'erreur de suppression' }))
        } else {
            res.json({message: 'Vous n etes pas le proprietaire du post !'});
        }
    })
    .catch(() => res.status(400).json({ message: 'erreur: commentaire introuvable' }));
}

/**
* exportation de la fonction getAllComments qui permet de récupérer tout les commentaires.
*/
exports.getAllComments = async (req, res, next) => {
    prisma.comment.findMany({ })
    .then((comments) => res.status(200).json({ comments }))
    .catch(() => res.status(400).json({ message: 'erreur: impossible de recuperer les commentaires.' }));
}

/**
* exportation de la fonction getOneComment qui permet de récupérer un commentaire.
*/
exports.getOneComment = async (req, res, next) => {
    prisma.comment.findUnique({
        where: {
            id: req.params.id
        }
    })
    .then((comment) => res.status(200).json({ comment }))
    .catch(() => res.status(400).json({ message: 'erreur: impossible de recuperer le commentaire.' }));
}

/**
* exportation de la fonction getOneComment qui permet de récupérer les commentaires d'un post.
*/
exports.getPostComments = async (req, res, next) => {
    try {
        const [comments, count] = await prisma.$transaction(
            [
                prisma.comment.findMany({
                    where: {
                        postId: req.body.postId
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        author: { select: { firstName: true, lastName: true } }
                    }
                }),
                prisma.comment.count({
                    where: {
                        postId: req.body.postId
                    }
                })
            ]);
            res.status(201).json({comments, count});
    } catch(e) {
        res.status(400).json({ message: `get comments failed` });
    }
}