const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createLike = (req, res , next) => {
    prisma.likes.create({
        data: {
            author: { connect: { id: req.auth.userId } },
            post: { connect:  { id: req.body.postId } },
            like: req.body.like 
        }
    })
    .then((post) => res.status(200).json({ post }))
    .catch((e) => res.status(400).json({ message: `postCreate failed: ${e}` }));
}