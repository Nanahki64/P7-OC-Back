const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrUpdate = async (req, res , next) => {
    try {
        const [like, count, isLiked] = await prisma.$transaction(
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
            }),
            prisma.likes.findUnique({
                where: { 
                    postId_authorId: { 
                        authorId: req.auth.userId,
                        postId: req.body.postId
                    }
                },
            })
        ]);
        let alreadyLiked = !!isLiked;
        res.status(201).json({like, count, alreadyLiked});
    } catch(e) {
        res.status(400).json({ message: `postCreate failed: ${e}` });
    }
}

exports.deleteLike = async (req, res , next) => {
    try {
        const [del, count, isLiked] = await prisma.$transaction(
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
            }),
            prisma.likes.findUnique({
                where: { 
                    postId_authorId: { 
                        authorId: req.auth.userId,
                        postId: req.body.postId
                    }
                }
            })
        ]);
        let alreadyLiked = !!isLiked;
        res.status(201).json({count, alreadyLiked});
    } catch(e) {
        res.status(400).json({ message: `deleteLike failed: ${e}` });
    }
}

exports.getLikesCount = async (req, res, next) => {
    try {
        const [count, isLiked] = await prisma.$transaction([
            prisma.likes.count({
                where: {
                    postId: req.params.id
                }
            }),
            prisma.likes.findUnique({
                where: { 
                    postId_authorId: { 
                        authorId: req.auth.userId,
                        postId: req.params.id
                    }
                },
            })
        ]);
        let alreadyLiked = !!isLiked;
        res.status(201).json({count, alreadyLiked});
    } catch(e) {
        res.status(400).json({ message: 'erreur: impossible de recuperer le nombre de likes.' });
    }
}