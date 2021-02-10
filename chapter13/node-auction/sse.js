const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server);
    sse.on('connection', (client) => { //서버센트 이벤트 연결
        setInterval(() => {
            client.send(Date.now().toString());
        }, 1000); // 1초마다 시간을 문자열로 치환해서 클라이언트로 전송해준다.
    }); 
};