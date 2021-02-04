const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const { addFollowing, addUnFollowing, profileUpdate } = require('../controllers');

const router = express.Router();

router.post('/update', isLoggedIn, profileUpdate);

router.post('/:id/follow', isLoggedIn, addFollowing);

router.post('/:id/unfollow', isLoggedIn, addUnFollowing);

module.exports = router;