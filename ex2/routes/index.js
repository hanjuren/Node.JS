const express = require('express');
const { User } = require('../models');
const Post = require('../models/post');

const router = express.Router();

router.use(async(req, res, next) => {
    res.locals.user = req.user;
    try{
        if(req.user) {
            let postCount = await Post.findAll({
                where: {UserId: req.user.id}
            });
            res.locals.postCount = postCount.length;
        } else {
            res.locals.postCount = 0;
        }
    } catch(error) {
        console.log(error);
    }
    next();
});

router.get('/', async(req, res, next) => {
    try{
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
                
            },
            order: [['id', 'DESC']],
        });
        res.render('main', { title: '블로그', posts } );
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;