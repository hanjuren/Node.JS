const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) { // 서버 에러일경우
            console.error(authError);
            return next(authError);
        }
        if(!user) { // 로그인이 실패한 경우
            return res.redirect(`./?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError) { // 에러가 있었다면
                console.log(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 넣어준다.
});

router.post('/join', async(req, res, next) => {
    const { uid, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { uid } }); // 기존 이메일과 중복인지 검색.
        if (exUser) {
            return res.redirect('./join'); // 입력된 이메일과 동일한 가입정보가 있다면 join페이지로 돌려보냄
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화 두번째 인수 12이상 추천 31까지 가능 프로미스를 지원하는 함수 이므로 await 사용
        await User.create({  // 사용자 정보 생성
            uid,
            nick,
            password : hash,
        });
        return res.redirect('/'); 
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/join', (req, res) => {
    res.render('join', {
        title: '회원가입 - Blog',
    });
});

module.exports = router;