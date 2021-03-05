const express = require('express');
const { User } = require('../models');
const Post = require('../models/post');
const Comment = require('../models/comment');

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
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],   
                },
                {
                    model: Comment,
                    attributes: ['comment'],
                    include: {
                        model: User,
                        attributes: ['id', 'nick'],
                    },
                },
            ],
            order: [['id', 'DESC']],
        });
        console.log(posts);
        console.log("댓글", Comment);
        res.render('main', { title: '블로그', posts } );
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/profile', async(req, res, next) =>{
    try {
        const posts = await Post.findAll({
            where: {UserId: req.user.id},
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['id', 'DESC']],
        });
        res.render('profile', { title: '프로필 페이지', posts });
    } catch(error) {
        console.log(error);
        next(error);
    }
});

router.get('/profile/post', async(req, res, next) => {
    try {
        const posts = await Post.findAll({
            where: {UserId: req.user.id},
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['id', 'DESC']],
        });
        res.render('profilePost', { title: '프로필 페이지', posts });
    } catch (error){
        console.log(error);
        next(error);
    }
});


module.exports = router;