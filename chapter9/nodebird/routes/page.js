const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Hashtag } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    //res.locals.likelist = req.user && req.like ? req.like.map(f => f.Likers) : [];
    next();
  });

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async(req, res, next) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['id', 'nick'],
            }, {
                model: User,
                as: 'Likers',
                attributes: ['id', 'nick'],
            },],
            order: [['createdAt', 'DESC']],
        });
        const post = JSON.stringify(posts);
        console.log(post);
        // const like = post.id;
        // console.log(like);
        // console.log('ㄹ오너ㅣㄹㅁㄴ: ', res.locals.likelist);
        //const like = posts.Likers.map(i=>i.id).includes(user.id);
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
            
            like: post,
            //like: posts.Likers,
        });   
    } catch (error) {
        console.error(error);
        next(error);
    } 
});


router.get('/hashtag', async(req, res, next) => {
    const query = req.query.hashtag;
    if(!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: {title: query} });
        let posts = [];
        if(hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User, attributes: ['id', 'nick'] }] });
        }

        return res.render('main', {
            title: `#${query} | NodeBird`,
            twits: posts,
        });
    } catch (error){
        console.error(error);
        return next(error);
    }
});

module.exports = router;