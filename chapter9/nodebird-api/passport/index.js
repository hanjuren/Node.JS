const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');
const User= require('../models/user');

module.exports = () => {
    // 로그인시 실행되며 req.seesion 객체에 id를 담는 메서드 매개변수에 user를 받아와서 done에 user.id를 넣어준다
    passport.serializeUser((user, done) => { 
        done(null, user.id); // 세션에 user.id만 저장 
    });

    // 세션에 저장된 id를 통해 사용자 정보 객체를 불러온다. 
    // deserializeUser의 id 매개변수는 serializeUser에서 done에 담았던 두번째 인수가 오게된다.
    // 결과값 done의 user는 req.user로 조회할 수 있다.
    passport.deserializeUser((id, done) => {
        
        User.findOne({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }], 
        })
            .then(user => done(null, user))
            .catch(err => done(err)); 
    });
    

    local();
    kakao();
    naver();
};