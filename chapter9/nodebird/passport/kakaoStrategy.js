const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy ({
        clientID: process.env.KAKAO_ID, // 카카오에서 발급받을 ID
        callbackURL: '/auth/kakao/callback', // 카카오로부터 인증결과를 받을 라우터 주소
    }, async (accessToken, refreshRoken, profile, done) => {  // 카카오에서 인증 후 Token 과 profile을 보내준다.
        //console.log('kakao profile', profile);
        process.env.KAKAOACCESS= accessToken;
        console.log("엑세스 토근")
        console.log(process.env.KAKAOACCESS);
        console.log(accessToken);
        
        try {
            const exUser = await User.findOne({     // 기존의 User가 있는지 조회
                where: { snsId: profile.id, provider: 'kakao' },
            });
            if(exUser) {   // 기존 User의 정보가 있다면 User정보를 done과 호출하고 전략을 종료
                done(null, exUser);
            } else {  // 기존의 User정보가 없다면 회원가입을 진행
                const newUser = await User.create({
                    email: profile._json && profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, exUser); // 사용자 생성 후 done함수 호출
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
    }));
};