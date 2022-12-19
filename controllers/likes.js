const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrUpdate = async (req, res , next) => {
    try {
        const [like, count] = await prisma.$transaction(
        [ 
            prisma.likes.upsert({
                where: { 
                    postId_authorId: { 
                        authorId: req.auth.userId,
                        postId: req.body.postId
                    }
                },
                create: {
                    author: { connect: { id: req.auth.userId } },
                    post: { connect:  { id: req.body.postId } },
                    like: req.body.like
                },
                update: {
                    like: req.body.like
                },
                select: {
                    like: true
                }
            }),
            prisma.likes.count({
                where: {
                    postId: req.body.postId
                }
            })
        ]
        );
        res.status(201).json({like, count});
    } catch(e) {
        res.status(400).json({ message: `postCreate failed: ${e}` });
    }
}

exports.deleteLike = async (req, res , next) => {
    try {
        const count = await prisma.$transaction(
        [ 
            prisma.likes.delete({
                where: { 
                    postId_authorId: { 
                        authorId: req.auth.userId,
                        postId: req.body.postId
                    }
                }
            }),
            prisma.likes.count({
                where: {
                    postId: req.body.postId
                }
            })
        ]
        );
        res.status(201).json({count});
    } catch(e) {
        res.status(400).json({ message: `deleteLike failed: ${e}` });
    }
}

exports.getLikesCount = (req, res, next) => {
    prisma.likes.count({
        where: {
            postId: req.params.id
        }
    })
    .then((likes) => res.status(200).json({likes}))
    .catch(() => res.status(400).json({ message: 'erreur: impossible de recuperer le nombre de likes.' }))
}