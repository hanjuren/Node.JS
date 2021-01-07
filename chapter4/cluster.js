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