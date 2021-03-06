const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async(req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } }); // 기존 이메일과 중복인지 검색.
        if (exUser) {
            return res.redirect('./join?error=exist'); // 입력된 이메일과 동일한 가입정보가 있다면 join페이지로 돌려보냄
        }
        const hash = await bcrypt.hash(password, 12); // 비밀번호 암호화 두번째 인수 12이상 추천 31까지 가능 프로미스를 지원하는 함수 이므로 await 사용
        await User.create({  // 사용자 정보 생성
            email,
            nick,
            password : hash,
        });
        return res.redirect('/'); 
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    //미들웨어를 확장하는 패턴 6장
    // /auth/login이 실행되면 passport.authenticate 가 localStrategy를 찾는다.
    passport.authenticate('local', (authError, user, info) => {
        if (authError) { // 서버 에러일경우
            console.error(authError);
            return next(authError);
        }
        if(!user) { // 로그인이 실패한 경우
            return res.redirect(`./?loginError=${info.message}`);
        }
        // req.login(user) 하는 순간 passport/index.js 로 이동
        // index에서 serializeUser done 후 나머지 실행
        return req.login(user, (loginError) => {
            if(loginError) { // 에러가 있었다면
                console.log(loginError);
                return next(loginError);
            }
            //로그인 성공
            
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 넣어준다.
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/')
});

router.get('/naver', passport.authenticate('naver'));

router.get('/naver/callback', passport.authenticate('naver', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/')
});

module.exports = router;