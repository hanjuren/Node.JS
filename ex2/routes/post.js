const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = require('../models/post');
const router = express.Router();


try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성 합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
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

module.exports = router;