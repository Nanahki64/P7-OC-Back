const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPost = async (req, res, next) => {
    const post = await prisma.post.create({
        data: {
            title: req.body.title,
            body: req.body.body,
            author: { connect: { email: req.body.email } }
        }
    })
    res.json(post);
};

exports.getAllPosts = async (req, res, next) => {
    const post = await prisma.post.findMany({
        where: {
            author: { email: req.body.email }
        }
    })
    res.json(post);
};