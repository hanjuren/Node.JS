const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

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
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json( { url: `/img/${req.file.filename}`});
});

router.post('/', isLoggedIn, upload.none(), async(req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });

        const hashtags = req.body.content.match(/#[^\s#]*/g); // 정규식
        // [#노드, #익스프레스] 같은 해시태그 배열을
        // [노드, 익스프레스]로 #을 뺴서 정렬하고
        // findOrCreate 값이 있으면 false, 없으면 true반환 하고 생성
        if(hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where: { title: tag.slice(1).toLowerCase() },
                    })
                }),
            );
            console.log(result);
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.delete('/:id/delete', isLoggedIn, async(req, res, next) => {
    try {
        const expost = await Post.findOne({ where: { id: req.params.id } });
        if(expost){
            await Post.destroy({
                where: { id: req.params.id } 
            });
        }
        res.send('succes');    
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/like', async(req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id } });
        if(post) {
            await post.addLiker(req.user.id);
            res.send('succes');
            console.log('좋아요 성공');
        } else {
            console.log('좋아요 실패');
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/unlike', async(req, res, next) => {
    
});


module.exports = router;