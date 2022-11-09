const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * exportation de la fonction createPost qui permet de créer un post. 
 */
exports.createPost = async (req, res, next) => {
    const post = await prisma.post.create({
        data: {
            title: req.body.title,
            content: req.body.content,
            author: { connect: { email: req.body.email } }
        }
    })
    res.json(post);
};

/**
 * exportation de la fonction getAllPosts qui permet de récupérer tout les posts. 
 */
exports.getAllPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({ })
    res.json(posts);
};

/**
 * exportation de la fonction getOnePost qui permet de récupérer un post via son id. 
 */
exports.getOnePost = async (req, res, next) => {
    const post = await prisma.post.findUnique({
        where: {
            id: req.params.id,
        }
    })
    res.json(post);
}