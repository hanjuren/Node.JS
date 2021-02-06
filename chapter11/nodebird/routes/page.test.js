const request = require("supertest");
const app = require('../app');
const { sequelize } = require('../models');

describe('회원가입 페이지 테스트', () => {
    test('로그인 안했으면 가입 페이지로 ', async(done) => {
        request(app)
            .get('/join')
            .send({
                title: '회원가입 - NodeBird'
            })
            .expect(200, done);
    });

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

    test('로그인했으면 가입 페이지로 못감', async(done) => {
        const message = encodeURIComponent('로그인한 상태입니다.');
        agent
            .get('/join')
            .expect('Location', `/?error=${message}`)
            .expect(302, done);
    });

});

describe('프로필 페이지 테스트', () => {
    test('로그인 안했으면 프로필 페이지로 못감 ', async(done) => {
        request(app)
            .get('/profile')
            .send(
                '로그인필요'
            )
            .expect(403, done);
    });

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

    test('로그인했으면 프로필로 ', async(done) => {
        agent
            .get('/profile')
            .send({
                title: '내 정보 - NodeBird'
            })
            .expect(200, done);
    });

});