const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

//라우터를 불러온다.
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT || 3000); 
// app.set은 서버에 포트라는 속성을 3000으로 넣는다.

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session( {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('user/:id', userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use( (err, req, res, next) => { //에러 미들웨어는 반드시 4가지 매개변수를 입력해야한다.
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; //process.env.NODE_ENV가 production이 아닐때 에러스택 표시
    res.status(err.status || 500);
    res.render('error');
    //console.log(err);
    //res.status(500).send(err.message); // res.status()는 에러처리할때 에러번호를 커스터마이징 할수있다.
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중' );
});