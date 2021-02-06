// socket io 사용
const SoketIO = require('socket.io');

module.exports = (server) => {
    const io = SoketIO(server, { path: '/socket.io' });

    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);

        socket.on('disconnect', () => { // 연결 종료 시
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
        });

        socket.on('error', (error) => { // 에러 시
            console.error(error);
        });

        socket.on('reply', (data) => { //클라이언트로부터 메시시 수신 시
            console.log(data);
        });
        
        socket.interval = setInterval( () => {
            
            socket.emit('news',
             'Hello Socket.IO');
            
        },3000);
        
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