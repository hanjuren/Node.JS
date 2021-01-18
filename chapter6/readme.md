# Chapter6. Express 서버 만들기

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

---

5. req, res 객체 살펴보기

    **req객체**
    * req.app : req객체를 통해 app객체에 접근할 수 있습니다.
    * req.body : body-parser미들웨어가 만드는 요청의 쿠키를 해석한 객체입니다.
    * req.cookies : cookie-parser가 만드는 요청의 쿠키를 해석한 객체입니다.
    * req.ip : 요청의 ip주소가 담겨 있습니다.
    * req.params : 라우트 매개변수에 대한 정보가 담긴 객체입니다
    * req.query : 쿼리스트링에 대한 정보가 담긴 객체입니다
    * req.signdeCookies : 서명된 쿠키들은 req.cookies대신 여기에 담겨 있습니다.
    * req.get(헤더 이름) : 헤더의 값을 가져오고 싶을때 사용하는 메서드 입니다.

    **res객체**
    * res.app : req.app처럼 res객체를 통해 app객체에 접근할 수 있습니다.
    * res.cookie(키, 값, 옵션) : 쿠키를 설정하는 메서드입니다.
    * res.clearCookie(키, 값, 옵션) : 쿠키를 제거하는 메서드입니다.
    * res.end() : 데이터 없이 응답을 보냅니다.
    * res.json(JSON) : JSON형식의 응답을 보냅니다.
    * res.redirect(주소) : 리다이렉트할 주소와 함께 응답을 보냅니다.
    * res.render(뷰, 데이터) : 다른 템플릿 엔진을 사용할때 템플릿 엔진을 렌더링해 응답할 때 사용하는 메서드입니다.
    * res.send(데이터) : 데이터와 함께 응답을 보냅니다. 
    * res.sendFile(경로) : 경로에 위치한 파일을 응답합니다.
    * res.set(헤더, 값) : 응답의 헤더를 설정합니다.
    * res.status(코드) : 응답 시의 HTTP상태 코드를 지정합니다.

---

6. 템플릿 엔진

    HTML의 정적인 단점을 개선
    * 반복문, 조건문, 변수 등을 사용할 수 있음
    * 동적인 페이지 작성 가능
    * PHP, JSP와 유사함

    PUG
    html문법과 비슷하지만 닫는 태그가 없고 들여쓰기로 줄바꿈을 처리한다.
    ```
    doctype html
    html
    head
        title= title
        
    body
        block content1
        block content
    ```
---

7. 에러 처리 미들웨어

    ```js
    app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
    });

    app.use( (err, req, res, next) => { //에러 미들웨어는 반드시 4가지 매개변수를 입력해야한다.
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
        res.status(err.status || 500);
        res.render('error');
        //console.log(err);
        //res.status(500).send(err.message); // res.status()는 에러처리할때 에러번호를 커스터마이징 할수있다.
    });
    ```
    이 코드는 만약 404 에러가 발생시 res,locals.message는 `${req.method} ${req.url} 라우터가 없습니다.`가 됩니다. next(error)에서 넘겨준 인수가 에러처리 미들웨어의 err로 연결되기 때문입니다.
---





