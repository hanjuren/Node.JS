const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

// 로그인 상태를 조회해서 라우터 접근 설정.
// page라우터에서 사용..
exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req, res, next) =>{
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') { // 유효 기간 초과
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.',
        });
    }
};

exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000, //1분
    max: 5,
    delayMs: 0,
    handler(req, res) {
        res.status(this.statusCode).json({ // 기본 429 사용량을 넘었다라는 의미
            code: this.statusCode,
            message: '1분에 한번만 요청이 가능합니다.',
        });
    },
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 이용해주세요.',
    });
};