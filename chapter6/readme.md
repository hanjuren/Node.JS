# Express 서버 만들기

1. express 프로젝트 시작

    1. 프로젝트 폴더 생성 후 package.json파일 생성 (npm init 명령어 사용)
    > package.json
    ``` json
    {
    "name": "learn-express",
    "version": "0.0.1",
    "description": "익스프레스 배우기",
    "main": "app.js",
    "scripts": {
        "start": "nodemon app"
    },
    "author": "hanjuren",
    "license": "MIT",
    "dependencies": {
        "express": "^4.17.1"
    },
    "devDependencies": {
        "nodemon": "^2.0.7"
    }
    }
    ```
    exress, nodemon 패키지도 설치
    2. 실행할 app.js파일 생성
    ``` js
    const express = require('express'); //express패키지 불러오기

    const app = express();
    app.set('port', process.env.PORT || 3000); 
    // app.set은 서버에 포트라는 속성을 3000으로 넣는다.

    app.get('/', (req, res) => {
        res.send('Hello Express');
    });
    //app.get을 통해 요청에대한 응답 설정
    app.listen(app.get('port'), () => {
        console.log(app.get('port'), '번 포트에서 대기중' );
    });
    ```
    3. nodemon을 이용해 서버 실행
    ```
    npm start
    > nodemon app

    [nodemon] 2.0.7
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node app.js`
    3000 번 포트에서 대기중
    ```
    nodemon은 코드의 수정이 있을때마다 자동적으로 재실행 됩니다.
---
2. html파일을 불러와 서버 실행

    ```js
    const path = require('path');
    ```
    ```js
    res.sendFile(path.join(__dirname, './index.html') );
    ```
    path모듈을 이용해 경로를 지정하고 sendFile로 파일을 불러온다.
---
3. 자주 사용하는 미들웨어

    미들웨어는 익스프레스의 핵심입니다. 요청과 응답의 중간에 위치하여 사용됩니다.  
    미들웨어는 app.use와 함께 사용됩니다. 

    미들웨어 기본.
    > app.js
    ```js
    ...
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

    app.use( (err, req, res, next) => { //에러 미들웨어는 반드시 4가지 매개변수를 입력해야한다.
        console.log(err);
        res.status(500).send(err.message); // res.status()는 에러처리할때 에러번호를 커스터마이징 할수있다.
    });

    app.listen(app.get('port'), () => {
    ...
    ```
    app.use에 매개변수가 req, res, next인 함수를 넣으면 된다. 미들웨어는 위에서부터 아래로 순서대로 실행되며 요청과 응답사이에 특별한 기능을 추가할 수 있다.  
    next매개변수는 다음 미들웨어로 넘어가는 함수다. next를 실행하지 않으면 다음 미들웨어로 넘어가지 않는다.

    | <span style="color:orange">미들웨어가 실행되는 경우</span> ||
    | --- | --- |
    | app.use(미들웨어) | 모든요청에서 미들웨어 실행 |
    | app.use('/abc', 미들웨어) | abc로 시작하는 요청에서 미들웨어 실행 |
    | app.post('/abc', 미들웨어) | abc로 시작하는 POST 요청에서 미들웨어 실행 |

    morgan
    ```js
    app.use(morgan('dev'));
    ```
    ```
    GET / 500 14.568 ms - 49
    ```
    [HTTP메서드] [주소] [HTTP상태 코드] [응답속도] -[응답바이트]를 의미한다.

    static

    정적인 파일들을 제공하는 라우터 역할을 한다.  

    body-parser

    요청의 본문에 있는 데이터를 해석하여 req.body로 만들어주는 미들웨어입니다.  
    보통 폼 데이터나 AJAX 요청의 데이터를 처리합니다.

    익스프레스 4.16.0버전부터 일부기능이 익스프레스에 내장되어 별도 설치는 하지 않아도 된다.

    ``` js
    app.use(express.json());
    app.use(express.urlencoded( { extended: false }));
    ```

    cookie-parser

    요청에 동봉된 쿠키를 해석해 req.cookies객체로 만든다.
---

4. 미들웨어의 특성 활용

    미들웨어는 req, res, next를 매개변수로 가지는 함수(에러 처리 미들웨어만 예외적으로 err을 가짐)로서 app.use, app.get, app.post로 장착된다. 특정한 주소의 요청에만 미들웨어가 실행되게 하려면 첫번째 인수로 주소를 넣으면 된다.

    next에 인수를 넣을수도 있다. route라는 인수를 넣으면 다음 라우터의 미들웨어로 이동하고 에러를 넣으면 에러 처리 미들웨어로 바로 이동한다.

    





