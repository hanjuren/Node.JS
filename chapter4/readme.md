# 4장 http 모듈로 서버 만들기

1. 요청과 응답

    > server1.js

    ```js
    const http = require('http');

    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' });
        res.write('<h1>Hello Node!</h1>');
        res.end('<p>Hello Server</p>');
    })

        .listen(8080, () => { // 서버 연결
            console.log('8080포트에서 서버 대기중입니다.');
        });
    ```
    > 결과
    ```
    node chapter4/server1.js
    8080포트에서 서버 대기중입니다.
    ```
    createServer 메서드 뒤에 listen 메서드를 붙이고 클라이언트에 공개할 포트 번호와 포트 연결 완료 후 실행될 콜백 함수를 넣는다.  
    res 객체는 res.wirteHead, res.write, res.end 메서드가 있다.  
    **res.wirteHead** 메서드는 응답에 대한 정보를 기록하는 메서드이다. 첫번째 인수로 성공적 연결을 의미하는 200을 두번째 인수는 보내는 콘텐츠의 형식이 HTML임을 알려준다. 이정보가 기록되는 부분을 **Header** 라고 부른다  
    **res.wirte** 메서드의 인수는 클라이언트로 보낼 데이터이다. 데이터가 기록되는 부분을 **Body** 라고 부른다.

    ---
    fs모듈로 html파일을 읽어서 전송하기.
    > server2.html
    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Node.js 웹서버</title>
    </head>
    <body>
        <h1>Node.js 웹서버</h1>
        <p>만들 준비되셨나요?</p>
    </body>
    </html>
    ```
    > server2.js
    ```js
    const http = require('http');
    const fs = require('fs').promises;

    http.createServer(async(req, res) => {
        try{
            const data = await fs.readFile('./chapter4/server2.html');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        } catch(err) {
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(err.message);
        };
    })
        .listen(8081, () => {
            console.log('8081번 포트에서 서버 대기중입니다.');
        });
    ```
    > 결과
    
    <img src = "https://user-images.githubusercontent.com/73157543/103769431-96fdc880-5067-11eb-9c54-e72aa87ffb47.jpg" width="40%">

2. REST와 라우팅 사용하기

    REST는 REpresentational State Transfer의 줄임말로 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법을 가리킨다.  
    주소는 의미를 명확히 전달하기 위한 명사로 구성된다. 하지만 단순히 명사로만은 무슨 동작을 행하라는 것인지 알기 어려우므로 REST에서는 주소외에도 HTTP 요청 메서드라는 것을 사용한다.  
    
    요청메서드의 종류
    * GET : 서버 자원을 가져오고자 할 때 사용한다.
    * POST : 서버의 자원을 새로 등록하고자 할 떄 사용한다.
    * PUT : 서버의 자원을 요청에 들어 있는 자원으로 치환하고자 할 때 사용한다.
    * PATCH : 서버 자원의 일부만 수정하고자 할 때 사용한다.
    * DELETE : 서버의 자원을 삭제하고자 할 때 사용한다.
    * OPTIONS : 요청을 하기 전에 통신 옵션을 설명하기 위해 사용한다.

3. 쿠키와 세션

    > cookie2.js
    ```js
    const http = require('http');
    const fs = require('fs').promises;
    const url = require('url');
    const qs = require('querystring');

    const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => {
        acc[k.trim()] = decodeURIComponent(v);
        return acc;
        }, {});

    const session = {};

    http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    if (req.url.startsWith('/login')) {
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        const uniqueInt = Date.now();
        session[uniqueInt] = {
        name,
        expires,
        };
        res.writeHead(302, {
        Location: '/',
        'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    // 세션쿠키가 존재하고, 만료 기간이 지나지 않았다면
    } else if (cookies.session && session[cookies.session].expires > new Date()) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`${session[cookies.session].name}님 안녕하세요`);
    } else {
        try {
        const data = await fs.readFile('./chapter4/cookie2.html');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
        } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(err.message);
        }
    }
    })
    .listen(8085, () => {
        console.log('8085번 포트에서 서버 대기 중입니다!');
    });
    ```
    > 결과

    <img src = "https://user-images.githubusercontent.com/73157543/103889387-ad6c5880-5129-11eb-9df7-f84f8fe9419f.jpg" width="40%" height="200px">
    <img src = "https://user-images.githubusercontent.com/73157543/103889457-cecd4480-5129-11eb-8782-578d5a3a6539.jpg" width="40%" height="200px">

    * 쿠키명=쿠키값 : 기본적인 쿠키값
    * Expires=날짜 : 만료기한이다. 기한이 지나면 쿠키가 제거 됩니다.
    * Max-age=초 : Expires와 비슷하지만 초를 입력한다. 
    * Domain=도메인명 : 쿠키가 전송될 도메인을 특정할 수 있다.
    * Path=URL : 쿠키가 전송될 URL을 특정할 수 있습니다
    * Secure : HTTPS일 경우만 쿠키가 전송
    * HttpOnly : 설정 시 자바스크립트에서 쿠키에 접급가능 쿠키 조작을 방지하기위해 설정하는 것이 좋다.
---
4. http와 http2

    https 모듈은 웹 서버에 SSL 암호화를 추가한다. GET, POST 요청을 할 때 오가는 데이터를 암호화해 중간에서 가로채더라도 확인할 수 없게 만든다. 요즘은 로그인이나 결제가 필요한 창에서 hpps적용이 필수가 되는 추세이다.  
    서버에 암호화를 적용하려면 https모듈을 이용해야하는데 인증을 해줄 기관도 필요하다. 이는 인증 기관에서 구매해야 하며 http암호화는 http2 모듈을 사용한다.
---

5. cluster

    cluster 모듈은 기본적으로 싱글 프로세스로 동작하는 노드가 CPU 코어를 모두 사용할 수 있게 해주는 모듈이다.

    > cluster.js
    ```js
    const cluster = require('cluster');
    const http = require('http');
    const numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
        console.log(`마스터 프로세스 아이디: ${process.pid}`);
        //CPU 개수만큼 워커 생산
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork(); //워커 생성
        }
        //워커가 종료되었을떄
        cluster.on('exit', (worker, code, signal) => {
            console.log(`${worker.process.pid} 번 포트가 종료되었습니다.`);
            console.log('code', code, 'signal', signal);
            cluster.fork();
        });
    } else {
        //워커들이 포트에서 대기
        http.createServer((req, res) => {
            res.writeHead(200, { 'Content-type': 'text/html; charset=utf8' });
            res.write('<h1>Hello Node!</h1>');
            res.end('<p>Hello Cluster!</p>');
            setTimeout(() => { //워커가 존재하는지 확인하기위해 1초마다 강제 종료
                process.exit(1);
            }, 1000);
        }).listen(8086); //8086포트로 연결

        console.log(`${process.pid}번 포트 실행;`)
    }
    ```
    > 결과
    ```
    node chapter4/cluster.js
    마스터 프로세스 아이디: 3496
    7904번 포트 실행;
    12800번 포트 실행;
    2600번 포트 실행;
    8584번 포트 실행;
    5200번 포트 실행;
    11644번 포트 실행;
    11644 번 포트가 종료되었습니다.
    code 1 signal null
    1616번 포트 실행;
    1616 번 포트가 종료되었습니다.
    code 1 signal null
    6248번 포트 실행;
    6248 번 포트가 종료되었습니다.
    code 1 signal null
    15328 번 포트가 종료되었습니다.
    ```
---
    
