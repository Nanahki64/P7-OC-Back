const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
* exportation de la fonction createPost qui permet de créer un post.
* newImageUrl vérifie si imageUrl contient une url et la renvoie, sinon renvoie une chaine de caractère vide.
* post persiste le post de l'utilisateur en base de donnée.
*/
exports.createPost = async (req, res, next) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const newImageUrl = req.body.imageUrl ? `${req.protocol}://${req.get('host')}/images/${req.body.imageUrl}` : '' ;
        if(title && (content || newImageUrl)) {
            const post = await prisma.post.create({
                data: {
                    title: title,
                    content: content,
                    imageUrl: newImageUrl,
                    author: { connect: { id: req.auth.userId } },
                }
            })
            res.json(post);
        } else {
            res.status(400).json({ message: 'Un titre et un contenue ou une image sont necessaire' });
        }
    } catch(e) {
        res.status(400).json({ message: `postCreate failed:` });
        // res.status(400).json({ message: `postCreate failed: ${e}` });
    }
};

/**
* exportation de la fonction modifyPost qui permet la modification d'un post. 
*/
exports.modifyPost = async (req, res, next) => {
    const post = await prisma.post.update({
        where: { id: req.params.id },
        data: {
            title: req.body.title,
        }
    })
    res.json(post);
}

/**
* exportation de la fonction modifyPost qui permet la modification d'un post.
*/
exports.deletePost = (req, res, next) => {
    const postId = req.params.id;
    const isAdmin = req.auth.isAdmin;
    const isAuthor = req.auth.userId;
  
    prisma.post.findUnique({
        where: { id: postId },
    })
    .then((post) => {
        if(isAdmin || (isAuthor == post.authorId)) {
            prisma.post.delete({
                where: { id: postId }
            })
            .then(() => res.status(200).json({ message: 'post supprime' }))
            .catch(() => res.status(400).json({ message: `erreur de suppression` }))
        }
    })
    .catch(() => res.status(400).json({ message: 'erreur: post introuvable' }));
}

/**
* exportation de la fonction getAllPosts qui permet de récupérer tout les posts. 
*/
exports.getAllPosts = (req, res, next) => {
    prisma.post.findMany({ })
    .then((posts) => res.status(200).json({ posts }))
    .catch((error) => res.status(400).json({ message: 'erreur: cant get posts' }));
};

/**
* exportation de la fonction getOnePost qui permet de récupérer un post via son id. 
*/
exports.getOnePost = (req, res, next) => {
    prisma.post.findUnique({
        where: { id: req.params.id },
        include: {
            author: { select: { firstName: true, lastName: true } }
        }
    })
    .then((post) => res.status(200).json({ post }))
    .catch((error) => res.status(400).json({ message: 'erreur: cant get post' }));
};