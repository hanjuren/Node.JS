# Chapter8. MONGO DB

1. 몽고 디비

    몽고 디비는 NO SQL 방식의 데이터 베이스다.  
    | SQL(My sql) | NoSQL(몽고디비) |
    |---|---|
    |규칙에 맞는 데이터 입력|자유로운 데이터 입력|
    |테이블간 JOIN지원|컬렌션 간 JOIN 미지원|
    |안정성, 일관성|확장성, 가용성|
    |용어(테이블, 로우, 컬럼|용어(컬렌션, 다큐먼트, 필드|

    Nosql의 특징
    * 고정된 테이블이 없다. 테이블에 상응하는 컬렉션이라는 개념이 있긴 하지만 컬럼을 따로 정의 하지는 않는다.
    * JOIN기능이 없다(aggregate로 비슷하게 구현 가능)
    * 비정형 테이터
    * 자바스크립트 문법을 사용해 자바스크립트만 사용해서 웹 애플리케이션을 만들 수 있다.

2. 데이터베이스 및 컬렉션 생성

     - 데이터 베이스를 만드는 명령어는 **use [데이터베이스명]** 이다.
     ```
     > use nodejs
     swiched to db nodejs
     ```
     - 데이터베이스 목록 확인 명령어는 **show dbs** 이다.
     ```
     > show dbs
     admin    0.000GB
     config   0.000GB
     local    0.000GB
     nodejs   0.000GB
     we-tube  0.000GB
     ```
     - 현재 사용중인 데이터베이스를 확인하는 명령어는 **db**이다.
     ```
     > db
     nodejs
     ```
     - 컬렉션 생성은 따로 할 필요는 없지만 직접 생성하려면 **db.createCollection('컬렉션명')** 으로 생성한다.
     - 생성한 컬렉션 목록을 확인하려면 **show collections** 명령어를 사용한다.
     ```
     > show collections
     comments
     users
     ```
 ---
3. CRUD 작업하기

    1. Create(생성)

        ```
        > db.users.save({ name: 'juren', age: 30, married: false, comment: '안녕하세요 몽고디비를 배우는 한주련입니다.', createdAt: new Date() });
        WriteResult({ "nInserted" : 1 })
        ```
    - db.컬렉션명.save(다큐먼트)로 다큐먼트를 생성할 수 있습니다.
    ---
    2. Read(조회)

    - find({}) : 컬렉션 내의 모든 다큐먼트 조회.
        ```
        > db.users.find({});
        { "_id" : ObjectId("6002eb01ed9338ce77c6a0a0"), "name" : "zere", "age" : "24", "married" : false, "comment" : "안녕하세 요 몽고디비배워보기", "createdAt" : ISODate("2021-01-16T13:32:49.241Z") }
        { "_id" : ObjectId("6002eb25ed9338ce77c6a0a1"), "name" : "nere", "age" : "24", "married" : true, "comment" : "제로 친구 네로", "createdAt" : ISODate("2021-01-16T13:33:25.489Z") }
        { "_id" : ObjectId("6002ed07066c1f17f2f49909"), "name" : "juren", "age" : 25, "married" : false, "createdAt" : ISODate("2021-01-15T16:43:00Z") }
        { "_id" : ObjectId("6004230f5443be9488880eb6"), "name" : "juren", "age" : 30, "married" : false, "comment" : "안녕하세요 몽고디비를 배우는 한주련입니다.", "createdAt" : ISODate("2021-01-17T11:44:15.320Z") }

        > db.comments.find({});
        { "_id" : ObjectId("6002ecfe0cf2677e998293c4"), "commenter" : ObjectId("6002eb01ed9338ce77c6a0a0"), "comment" : "안녕하 세요 제로의 댓글입니다.", "createdAt" : ISODate("2021-01-16T13:41:18.916Z") }
        ```
    - find({}, {조회할 필드}) : find 메서드의 두번째 인수에 조회하고 싶은 필드를 넣으면 특정 필드만 조회가 가능하다.
        ```
        > db.users.find({}, { _id: 0, name: 1, married: 1});
        { "name" : "zere", "married" : false }
        { "name" : "nere", "married" : true }
        { "name" : "juren", "married" : false }
        { "name" : "juren", "married" : false }
        ```
        - 1 또는 true로 표시한 필드만 가져온다. _id는 기본적으로 가져오게 되어있으므로 0 또는 false를 입력해 가져오지 않도록 할 수 있다.
    - find({조건}, {조회할 필드}) : 첫 번째 인수에는 조건을 입력할 수 있다.
        ```
        > db.users.find({ age: {$gt: 25}, married: false }, {_id: 0, name: 1, age: 1} );
        { "name" : "juren", "age" : 30 }
        ```
        |연산자 | |
        |:---:|:---:|
        |$gt|초과|
        |$gte|이상|
        |$lt|미만|
        |$lte|이하|
        |$ne|같지않음|
        |$or|또는|
        |$in|배열 요소 중 하나|
    - 정렬
        - sort 메서드 : 1은 오름차순 -1은 내림차순
        ```
        > db.users.find({}, {_id: 0, name: 1, age: 1}).sort({ age: -1})
        { "name" : "yang", "age" : 30 }
        { "name" : "juren", "age" : 25 }
        ```
        - limit : 조회할 다큐먼트 개수 설정
        ```
        > db.users.find({}, {_id: 0, name: 1, age: 1}).sort({ age: -1}).limit(1)
        { "name" : "yang", "age" : 30 }
        ```
        - skip : 다큐먼트 개수를 설정하면서 건너뛸 개수를 설정한다.
        ```
        > db.users.find({}, {_id: 0, name: 1, age: 1}).sort({ age: -1}).limit(1).skip(1)
        { "name" : "juren", "age" : 25 }
        ```
    ---
    3. Update(수정)

    - db.컬렉션명.update({수정할 다큐먼트}, {수정할내용}); : 두번째 객체에는 $set 연산자를 사용한다. 이 연산자를 이용하지 않는다면 다큐먼트가 통째로 수정되기 때문에 반드시 특정 필드만 수정 할 경우에는 $set 연산자를 이용한다.
        ```
        > db.users.update({ name: 'juren' }, { $set: { comment: '코멘트 필드를 바꿔보겠습니다.' } });
        WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
        > db.users.find({ name: 'juren' }, { _id: 0, name: 1, age: 1, comment: 1 });
        { "name" : "juren", "age" : 25, "comment" : "코멘트 필드를 바꿔보겠습니다." }
        ```
    ---
    4. Delete(삭제)

    - db.컬렉션명.remove({삭제할 정보가 담긴 객체})
        ```
        > db.users.remove({ name: 'yang' })
        WriteResult({ "nRemoved" : 1 })

        > db.users.find({}, { _id: 0, name: 1, age: 1 })
        { "name" : "juren", "age" : 25 }
        ```
---
4. 몽구스 사용하기

    몽구스는 ODM(Object Document Mapping)이라고 불린다.     
    
    몽고 디비 연결
    > schemas/index.js
    ```js
    const mongoose = require('mongoose');

    // 1번
    const connect = () => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
    // 2번
        mongoose.connect('mongodb://root:1210@localhost:27017/admin', {
            dbName: 'nodejs',
            useNewUrlParser: true,
            useCreateIndex: true,
        }, (error) => {
            if(error) {
                console.log('몽고디비 연결 에러', error);
            } else {
                console.log('몽고디비 연결 성공');
            }
        });
    };

    //3번
    mongoose.connection.on('error', (error) => {
        console.log('몽고디비 연결 에러', error);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.');
        connect();
    });

    module.exports = connect;
    ```
    * 1번 : 개발 환경일때만 콘솔을 통해 몽구스가 생성하는 쿼리내용을 확인 할 수 있게 하는 코드
    * 2번 : 몽구스와 몽고디비를 연결하는 부분
    * 3번 : 몽구스 커넥션에 이벤트 리스너를 달아두었음 에러발생시 에러 내용을 기록하고 연결 종료시 재연결 시도를 함

    스키마 정의하기
    > schemas/user.js
    ```js
    const mongoose = require('mongoose');

    const { Schema } = mongoose;
    const userSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true,
        },
        age: {
            type: Number,
            required: true,
        },
        married: {
            type: Boolean,
            required: true,
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    });

    module.exports = mongoose.model('User', userSchema);
    ```
    > schemas/comment.js
    ```js
    const mongoose = require('mongoose');

    const { Schema } = mongoose;
    const { Types: { ObjectId } } = Schema;
    const commentSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

    module.exports = mongoose.model('Comment', commentSchema);
    ```
    * id는 기본으로 생성되므로 id는 따로 적어줄 필요가 없다.
    * 몽고디비와의 자료형이 조금 다르며 String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array 등을 값으로 가질 수 있다.
    * commenter 속성에 자료형이 ObjectId이다. 옵션으로 ref 속성의 값이 User로 되어있는데 이것은 commenter 필드에 User 스키마의 사용자 ObjectId가 들어간다는 의미이다. 몽구스가 JOIN 비슷한 기능을 할때 사용된다.

    쿼리 수행하기

    > public/mongoose.js
    ```js
    // 사용자 이름 눌렀을 때 댓글 로딩
    document.querySelectorAll('#user-list tr').forEach((el) => {
        el.addEventListener('click', function () {
        const id = el.querySelector('td').textContent;
        getComment(id);
        });
    });
    ```
    * user-list tr 클릭시 td의 id를 가져온다.(id가 첫번째 td라서 가져올수있음.)

    ```js
    // 사용자 로딩
    async function getUser() {
        try {
        const res = await axios.get('/users'); // user라우터 
        const users = res.data; // 라우터에서 json데이터를 받아온다.
        console.log(users); // 가져온 users 확인
        const tbody = document.querySelector('#user-list tbody');
        tbody.innerHTML = '';
        users.map(function (user) {
            const row = document.createElement('tr');
            row.addEventListener('click', () => {
            getComment(user._id);
            });
            // 로우 셀 추가
            let td = document.createElement('td');
            td.textContent = user._id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.age;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.married ? '기혼' : '미혼';
            row.appendChild(td);
            tbody.appendChild(row);
        });
        } catch (err) {
        console.error(err);
        }
    }
    // 댓글 로딩
    async function getComment(id) {
        try {
        const res = await axios.get(`/users/${id}/comments`);
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML = '';
        comments.map(function (comment) {
            // 로우 셀 추가
            const row = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = comment._id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.commenter.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);
            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => { // 수정 클릭 시
            const newComment = prompt('바꿀 내용을 입력하세요');
            if (!newComment) {
                return alert('내용을 반드시 입력하셔야 합니다');
            }
            try {
                await axios.patch(`/comments/${comment._id}`, { comment: newComment });
                getComment(id);
            } catch (err) {
                console.error(err);
            }
            });
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async () => { // 삭제 클릭 시
            try {
                await axios.delete(`/comments/${comment._id}`);
                getComment(id);
            } catch (err) {
                console.error(err);
            }
            });
            // 버튼 추가
            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);
            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);
            tbody.appendChild(row);
        });
        } catch (err) {
        console.error(err);
        }
    }
    // 사용자 등록 시
    document.getElementById('user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = e.target.username.value;
        const age = e.target.age.value;
        const married = e.target.married.checked;
        if (!name) {
        return alert('이름을 입력하세요');
        }
        if (!age) {
        return alert('나이를 입력하세요');
        }
        try {
        await axios.post('/users', { name, age, married });
        getUser();
        } catch (err) {
        console.error(err);
        }
        e.target.username.value = '';
        e.target.age.value = '';
        e.target.married.checked = false;
    });
    // 댓글 등록 시
    document.getElementById('comment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = e.target.userid.value;
        const comment = e.target.comment.value;
        if (!id) {
        return alert('아이디를 입력하세요');
        }
        if (!comment) {
        return alert('댓글을 입력하세요');
        }
        try {
        await axios.post('/comments', { id, comment });
        getComment(id);
        } catch (err) {
        console.error(err);
        }
        e.target.userid.value = '';
        e.target.comment.value = '';
    });
    ```
    > 라우터 생성
    ```js
    //index.js
    const express = require('express');
    const User = require('../schemas/user'); //User 스키마를 require

    const router = express.Router();

    router.get('/', async (req, res, next) => { 
        try {
            const users = await User.find({}); // 몽고디비의 db.users.find({}) 와 동일.
            res.render('mongoose', {users}); // 쿼리 결과를 렌더링할때 변수로 넣어준다. 
        } catch (err) {
            console.log(err);
            next(err);
        }
    });

    module.exports = router;

    // users.js
    const express= require('express');
    const User = require('../schemas/user'); // User 스키마
    const Comment = require('../schemas/comment'); // Comment 스키마

    const router = express.Router();

    router.route('/') 
        .get(async (req, res, next) => { 
            try {
                const users = await User.find({});
                res.json(usrs); // 쿼리결과를 json형식으로 반환
            } catch (err) {
                console.log(err);
                next(err);
            }
        })
        .post(async (req, res, next) => {
            try {
                const user = await User.create({ // 다큐먼트 생성
                    name: req.body.name,
                    age: req.body.age,
                    married: req.body.married,
                });
                console.log(user);
                res.status(201).json(user);
            } catch (err) {
                console.log(err);
                next(err);
            }
        });

    router.get('/:id/comments', async (req, res, next) => {
        try {
            const comments = await Comment.find({ commenter: req.params.id }) // 댓글을 단 사용자의 아이디로 먼저 조회한 후
                .populate('commenter'); // populate 메서드를 이용해 관련이 있는 컬렉션의 다큐먼트를 불러온다.
            console.log(comments);
            res.json(comments);
        } catch (err) {
            console.log(err);
            next(err);
        }
    });

    module.exports = router;

    // comments.js
    const express = require('express');
    const Comment = require('../schemas/comment');

    const router = express.Router();

    router.post('/', async (req, res, next) => {
        try {
            const comment = await Comment.create({
                commenter: req.body.id,
                comment: req.body.comment,
            });
            console.log(comment);
            const result = await Comment.populate(comment, { path: 'commenter' });
            res.status(201).json(result);
        } catch (err) {
            console.log(err);
            next(err);
        }
    });

    router.route('/:id')
    .patch(async (req, res, next) => {
        try {
        const result = await Comment.update({
            _id: req.params.id,
        }, {
            comment: req.body.comment,
        });
        res.json(result);
        } catch (err) {
        console.error(err);
        next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
        const result = await Comment.remove({ _id: req.params.id });
        res.json(result);
        } catch (err) {
        console.error(err);
        next(err);
        }
    });

    module.exports = router;
    ``` 

