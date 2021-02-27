const express = require('express');
const { User } = require('../models');
const Post = require('../models/post');

const router = express.Router();

router.post('/:id/follow', async(req, res, next) => {
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

router.post('/:id/unfollow', async(req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if(user) {
            await user.removeFollowing(parseInt(req.params.id, 10));
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

module.exports = router;