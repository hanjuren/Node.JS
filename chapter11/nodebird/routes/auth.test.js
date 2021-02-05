const request = require("supertest");
const { sequelize } = require('../models');
const app = require('../app');
const naverStrategy = require("../passport/naverStrategy");

beforeAll(async () => { // 테스트를 실행하기 전에 실행되는 코드 
    await sequelize.sync(); // 데이터베이스에 테이블 생성
});

// 회원가입 테스트
describe('POST /join', () => {
    test('로그인 안 했으면 가입', (done) => {
        request(app)
            .post('/auth/join')
            .send({
                email: 'juren@naver.com',
                nick: '킹콩',
                password: '1234',
            })
            .expect('Location', '/')
            .expect(302, done);
    });
});

//로그인 한 사용자가 가입을 할경우 테스트 agent를 생성
//agent 는 상태를 만들어서 다른 테스트에서 재사용을 가능하게 해줌
describe('POST /join', () => {
    const agent = request.agent(app);
    beforeEach((done) => {
        agent
            .post('/auth/login')
            .send({
                email: 'juren@naver.com',
                password: '1234',
            })
            .end(done);
    });

    test('이미 로그인을 했을 경우 redirect /', (done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .post('/auth/join')
            .send({
                email: 'juren@naver.com',
                nick: '킹콩',
                password: '1234',
            })
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });
});

// 로그인 테스트

describe('POST /login', () => {
    // 가입되지 않은 회원 로그인시
    test('가입되지 않은 회원 로그인', async(done) => {
        const message = encodeURIComponent('가입되지 않은 회원입니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'juren1@naver.com',
                password: '1234',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });
    // 정상적 로그인시
    test('로그인 수행', async(done) => {
        request(app)
            .post('/auth/login')
            .send({
                email: 'juren@naver.com',
                password: '1234',
            })
            .expect('Location', '/')
            .expect(302, done);
    });

    // 비밀번호가 틀렸을때
    test('비밀번호가 틀렸습니다', async(done) => {
        const message = encodeURIComponent('비밀번호가 일치하지 않습니다.');
        request(app)
            .post('/auth/login')
            .send({
                email: 'juren@naver.com',
                password: '1212',
            })
            .expect('Location', `/?loginError=${message}`)
            .expect(302, done);
    });
});

// 로그아웃 테스트
describe('GET /logout', () => {
    //로그인이 되어있지 않을때 로그아웃 테스트
    test('로그인되어있지 않으면 403', async(done) => {
        request(app)
            .get('/auth/logout')
            .expect(403, done);
    });

    //로그아웃 실행 테스트
    const agent = request.agent(app);
    beforeEach( (done) =>{
        agent
            .post('/auth/login')
            .send({
                email: 'juren@naver.com',
                password: '1234'
            })
            .end(done);
    });

    test('로그아웃 수행', async(done) => {
        agent
            .get('/auth/logout')
            .expect('Location', '/')
            .expect(302, done);
    });
});


afterAll(async () => { // 테스트 종료시 실행되는 코드
    await sequelize.sync({ force: true }); // 데이터베이스 데이터 정리
});