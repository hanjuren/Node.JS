const { addFollowing, addUnFollowing, profileUpdate } = require('./user');
jest.mock('../models/user');
const User = require('../models/user');

describe('addFollowing', () => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        send: jest.fn(),
        status: jest.fn(()=>res),
    };

    const next = jest.fn();
    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        User.findOne.mockReturnValue(Promise.resolve({
            addFollowing(id){
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 찾지 못하면 res.status(404).send(no user)를 호출함', async () => {
        User.findOne.mockReturnValue(null);
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });

    test('DB에서 에러가 발생하면 next(error)을 호출함', async () => {
        const error = '테스트용 에러';
        User.findOne.mockReturnValue(Promise.reject(error));
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});

// 언팔로우
describe('addUnFollowing', () => {
    const req = {
        user: { id: 1 },
        params: { id: 2 },
    };
    const res = {
        send: jest.fn(),
        status: jest.fn(()=>res),
    };

    const next = jest.fn();
    test('사용자를 찾아 팔로잉을 삭제하고 success를 응답해야 함', async () => {
        User.findOne.mockReturnValue(Promise.resolve({
            removeFollowing(id){
                return Promise.resolve(true);
            }
        }));
        await addUnFollowing(req, res, next);
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 찾지 못하면 res.status(404).send(no user)를 호출함', async () => {
        User.findOne.mockReturnValue(null);
        await addUnFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });

    test('DB에서 에러가 발생하면 next(error)을 호출함', async () => {
        const error = '언팔로우 테스트용 에러';
        User.findOne.mockReturnValue(Promise.reject(error));
        await addUnFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});

describe('profileUpdate', () => {
    const req = {
        user: {id: 1},
        body: 'test',
    };
    const res = {
        redirect: jest.fn(),
    };
    const next = jest.fn();
    test('새로운 닉네임을 받아 닉네임 수정에 성공하면 redirect(/)', async () =>{
        User.update.mockReturnValue(Promise.resolve(true));
        await profileUpdate(req, res, next);
        expect(res.redirect).toBeCalledWith('/');
    });

    test('DB에서 에러가 발생하면 next(error)을 호출함', async () => {
        const error = '프로필수정 테스트용 에러';
        User.update.mockReturnValue(Promise.reject(error));
        await profileUpdate(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});