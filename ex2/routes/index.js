const express = require('express');
const { User } = require('../models');
const Post = require('../models/post');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.postCount = req.user? req.user.Posts.length : 0;
    next();
});

router.get('/', async(req, res, next) => {
    try{
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
        });
        res.render('main', { title: '블로그', posts } );
        console.log(req.user);
    } catch(error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;