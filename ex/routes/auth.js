const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res, next) => {
    const { uid, name, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { uid } });
        if (exUser) {
            return res.redirect('/join?joinError=이미 가입된 아이디 입니다.');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            uid,
            name,
            password: hash,
        });
        return res.redirect('/');
        } catch (error) {
            console.error(error);
            return next(error);
        }
  });
  
  
  
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/join', (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
    });
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;