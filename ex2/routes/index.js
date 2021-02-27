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
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
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