const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
* exportation de la fonction createPost qui permet de créer un post.
* newImageUrl vérifie si imageUrl contient une url et la renvoie, sinon renvoie une chaine de caractère vide.
* post persiste le post de l'utilisateur en base de donnée.
*/
exports.createPost = async (req, res, next) => {
    try {
        const newImageUrl = req.body.imageUrl ? `${req.protocol}://${req.get('host')}/images/${req.body.imageUrl}` : '' ;
        const post = await prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                imageUrl: newImageUrl,
                author: { connect: { id: req.auth.userId } },
            }
        })
        res.json(post);
    } catch(e) {
        console.log(e);
    }
};

/**
 * exportation de la fonction modifyPost qui permet la modification d'un post. 
 */
exports.modifyPost = async (req, res, next) => {
    console.log(req.params.id);
    const post = await prisma.post.update({
        where: { id: req.params.id },
    })
    res.json(post);
}

/**
* exportation de la fonction getAllPosts qui permet de récupérer tout les posts. 
*/
exports.getAllPosts = async (req, res, next) => {
    const posts = await prisma.post.findMany({ })
    //gerer les erreurs.
    res.json(posts);
};

/**
* exportation de la fonction getOnePost qui permet de récupérer un post via son id. 
*/
exports.getOnePost = async (req, res, next) => {
    const post = await prisma.post.findUnique({
        where: { id: req.params.id },
        include: {
            author: { select: { firstName: true, lastName: true } }
        }
    })
    //gerer les erreurs.
    res.json(post);
};