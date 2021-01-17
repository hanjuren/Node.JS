# Chapter7. MONGO DB

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
     - 생성한 컬렉션 목록을 확인하려면 **show collections 명령어를 사용한다.
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