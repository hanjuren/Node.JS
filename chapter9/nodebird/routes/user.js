const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/update', isLoggedIn, async(req, res, next) =>{
    const {nick} = req.body;
    try{
        const exnick = await User.update({
            nick: nick,
        }, {
            where: { id: req.user.id },
        });
        //res.send('succes');
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
    
});


router.post('/:id/follow', isLoggedIn, async(req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if(user) {
            await user.addFollowing(parseInt(req.params.id, 10));
            res.send('succes');
            console.log('성공');
        } else {
            console.log('살패');
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/unfollow', isLoggedIn, async(req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if(user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
            res.send('succes');
            console.log('성공');
        } else {
            console.log('실패');
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;