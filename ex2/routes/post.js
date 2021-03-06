const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const LargeComment = require('../models/largeComment');
const router = express.Router();


try {
    fs.readdirSync('uploads/img');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성 합니다.');
    fs.mkdirSync('uploads/img');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/img/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
            // cb(null, basename + Date.now() + extention);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json( { url:`/img/${req.file.filename}`});
});

router.post('/', upload.none(), async(req, res, next) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        console.log('게시글 : ', post)
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.get('/', (req, res) => {
    res.render('post', {title: '글쓰기'});
});

router.post('/comment/:id', async(req, res, next) => {
    try {
        const comment = await Comment.create({
            comment: req.body.comment,
            PostId: req.params.id,
            UserId: req.user.id,
        });
        console.log(comment);
        res.redirect(`/#${req.params.id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/largecomment/:id', async(req, res, next) => {
    try {
        const largeComment = await LargeComment.create({
            comment: req.body.comment,
            UserId: req.user.id,
            CommentId: req.params.id,
        });
        console.log("대댓글 :", largeComment);
        res.redirect('/');
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.delete('/:id/delete', async(req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        if(post) {
            await Post.destroy({
                where: { id: req.params.id } 
            });
        }
        res.send('succes');
        if(post.img){
            fs.unlinkSync(`./uploads${post.img}`);
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const post = await Post.findOne({ 
            where: { id: req.params.id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],   
                },
                {
                    model: Comment,
                    attributes: ['comment', 'id'],
                    include: [{
                        model: User,
                        attributes: ['id', 'nick'],
                    }, {
                        model: LargeComment,
                        attributes: ['comment'],
                    }],   
                }, 
            ],
        });
        res.json(post);
        console.log(post);
    } catch(error){
        console.log(error);
        next(error);
    }
});

module.exports = router;