// socket io 사용
const SoketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SoketIO(server, {path: '/socket.io' });
    app.set('io', io); // 라우터에서 req.get('io)로 접근 가능
    const room = io.of('/room');
    const chat = io.of('/chat');


room.on('connection', (socket) => { 
    console.log('room  네임스페이스 접속');
    socket.on('disconnect', () => {
        console.log('room 네임스페이스 접속 해제');
    });
});

chat.on('connection', (socket) => {
    console.log('chat 네임스페이스 접속');
    const req = socket.request;
    const { headers: { referer } } = req;
    // url 에서 roomid를 추출 하는 부분
    const roomId = referer
        .split('/')[referer.split('/').length -1]
        .replace(/\?.+/,'');
    // 밑의 join 과 leave는 웹 소켓에서 제공하는 메서드
    socket.join(roomId);

    socket.on('disconnect', () => {
        console.log('chat 네임스페이스 접속 해제');
        socket.leave(roomId);
    });
});

};






/* 웹 소켓 사용
const WebSoket = require('ws'); 

module.exports = (server) => {

    const wss = new WebSoket.Server({ server }); // 서버에 이벤트 리스너 생성

    wss.on('connection', (ws, req) => { //웹 소켓 연결 시 (클라이언트에서 연결) connection은 서버와 웹 소켓이 연결을 맺을때 발생
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트의 IP를 알아내는 방범
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => { // 클라이언트로 부터 메시지 수신 시 send로 보내면 수신
            console.log(message);
        });
        ws.on('error', (error) => { //에러 시
            console.error(error);
        });
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval);
        });

        ws.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
            if(ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        }, 3000);
    });
}; */