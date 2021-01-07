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

    
