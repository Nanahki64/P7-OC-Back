const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
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
        const newImageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '' ;
        if(title && (content || newImageUrl)) {
            prisma.post.create({
                data: {
                    title: title,
                    content: content,
                    imageUrl: newImageUrl,
                    author: { connect: { id: req.auth.userId } },
                }
            })
            .then((post) => res.status(200).json({ post }))
            .catch(() => res.status(400).json({ message: 'erreur: une erreur est survenue lors de la creation du post' }))
        } else {
            res.status(400).json({ message: 'Un titre et un contenue ou une image sont necessaire' });
        }
    } catch(e) {
        res.status(400).json({ message: `postCreate failed:` });
    }
};

/**
* exportation de la fonction modifyPost qui permet la modification d'un post. 
*/
exports.modifyPost = async (req, res, next) => {
    const postId = req.params.id;
    const isAdmin = req.auth.isAdmin;
    const isAuthor = req.auth.userId;
    const title = req.body.title;
    const content = req.body.content;
    const newImageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '' ;

    prisma.post.findUnique({
        where: { id: postId },
    })
    .then((post) => {
        if(isAdmin || (isAuthor == post.authorId)) {
                if(title && (content || newImageUrl)) {
                    const filename = post.imageUrl.split('/images/')[1];
                    //modification avec nouvelle image ou image supprimé.
                    if((newImageUrl || req.body.delete) && post.imageUrl) {
                        deleteImg(filename);
                        post.imageUrl = '';
                    }
                    prisma.post.update({
                        where: { id: postId },
                        data: {
                            title: title,
                            content: content ? content : post.content,
                            imageUrl: newImageUrl ? newImageUrl : post.imageUrl
                        }
                    })
                    .then(() => res.status(200).json({ message: 'post modifie' }))
                    .catch(() => res.status(400).json({ message: 'erreur: une erreur est survenue lors de la modification du post' }))
                } else {
                    res.status(400).json({ message: 'erreur: titre ou contenu manquant' });
                }
        } else {
            if(req.file) {
                deleteImg(req.file.filename);
            }
            res.status(400).json({ message: 'erreur: vous n etes pas le proprietaire du post' });
        }
    })
    .catch(() => {
        if(req.file) {
            deleteImg(req.file.filename);
        }
        res.status(400).json({ message: 'erreur: post introuvable' })
     });
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
            .then(() => {
                const filename = post.imageUrl.split('/images/')[1];
                if(filename != undefined) {
                    deleteImg(filename);
                }
                res.status(200).json({ message: 'post supprime' })
            })
            .catch(() => res.status(400).json({ message: `erreur de suppression` }))
        } else {
            res.json({message: 'Vous n etes pas le proprietaire du post !'});
        }
    })
    .catch(() => res.status(400).json({ message: 'erreur: post introuvable' }));
}

/**
* exportation de la fonction getAllPosts qui permet de récupérer tout les posts. 
*/
exports.getAllPosts = (req, res, next) => {
    prisma.post.findMany({ 
        orderBy: {
            id: 'desc'
        },
        include: {
            author: { select: { firstName: true, lastName: true } }
        }
     })
    .then((posts) => res.status(200).json({ posts }))
    .catch(() => res.status(400).json({ message: 'erreur: cant get posts' }));
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
    .catch(() => res.status(400).json({ message: 'erreur: cant get post' }));
};

function deleteImg(img) {
    fs.unlink(`images/${img}`, err => err && console.log(err));
}