const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000); 
// app.set은 서버에 포트라는 속성을 3000으로 넣는다.

app.use((req, res, next) => {
    console.log('모든 요청에 실행됩니다.');
    next();
});

app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러처리 미들웨어로 갑니다.');
});

app.use( (err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중' );
});