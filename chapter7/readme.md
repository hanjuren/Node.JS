# MYSQL

1. 테이블 생성하기

    > users 테이블
    ```sql
    create table nodejs.users(
    -> id INT NOT NULL AUTO_INCREMENT,
    -> name VARCHAR(20) NOT NULL,     
    -> age INT UNSIGNED NOT NULL,
    -> married TINYINT NOT NULL, 
    -> comment TEXT NULL,        
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> UNIQUE INDEX name_UNIQUE (nameASC))   
    -> COMMENT= '사용자정보'
    -> DEFAULT CHARSET=utf8mb4
    -> ENGINE = InnoDB;
    ```
    > comments 테이블
    ```sql
    CREATE TABLE nodejs.comments (
    -> id INT NOT NULL AUTO_INCREMENT,
    -> commenter INT NOT NULL,
    -> comment VARCHAR(100) NOT NULL,
    -> created_at DATETIME NOT NULL DEFAULT now(),
    -> PRIMARY KEY(id),
    -> INDEX commenter_idx (commenter ASC),
    -> CONSTRAINT commenter
    -> FOREIGN KEY (commenter)
    -> REFERENCES nodejs.users (id)
    -> ON DELETE CASCADE
    -> ON UPDATE CASCADE)
    -> COMMENT = '댓글'
    -> DEFAULT CHARSET=utf8mb4
    -> ENGINE=InnoDB;
    ```
    > 생성된 테이블
    ```sql
    mysql> SHOW TABLES;
    +------------------+
    | Tables_in_nodejs |
    +------------------+
    | comments         |
    | users            |
    +------------------+
    2 rows in set (0.01 sec)
    ```
    ---    
    컬럼의 자료형

    * INT : 정수를 의미 소수까지 정하고 싶다면 FLOAT DOUBLE 자료형을 사용하면 됨
    * VARCHAR(자릿수) : 문자열 VARCHAR 외에 CHAR이라는 자료형도 있다. 고정길이 가변길이라는 차이점이 있다.
    * TEXT : 긴 글을 저장할때 사용
    * TINYINT : -128 ~ 127의 정수를 저장할때 사용합니다. 1 또는 0 만 저장한다면 BOOLEAN과 같은 역할을 할 수 있습니다.
    * DATETIME : 날짜와 시간에대한 정보를 담고 있다. 날짜만 담는 DATE 시간정보만 담는 TIME도 있습니다.

    옵션

    * NULL, NOT NULL : 빈칸을 허용할지의 여부를 묻는 옵션
    * AUTO_INCREMENT : 숫자를 자동적으로 올리는 옵션
    * UNSIGNED : 숫자 자료형에 적용되는 옵션 숫자 자료형은 기본적으로 음수범위를 지원하는데  
    UNSIGNED가 적용되면 음수는 무시되고 0부터 저장할 수 있습니다. 단 FLOAT, DOUBLE에는 적용할 수 없습니다.
    * ZEROFILE : 숫자의 자릿수가 고정되어 있을때 사용가능 합니다. 
    * DEFAULT now() : 데이터베이스 저장 시 해당 컬럼에 값이 없다면 mysql이 기본값을 대신 넣어줍니다.  
    now()는 현재 시각을 넣으라는 뜻 입니다. now()대신 CURERENT_TIMESTAMP를 적어도 같은 의미입니다.
    * PRIMARY KEY : 기본키이며 기본키란 로우를 대표하는 고유한 값을 의미합니다. 
    * UNIQUE_INDEX : 해당 값이 고유해야 하는지에 대한 옵션입니다.
    * ON DELETE CASCADE, ON UPDATE CASCADE : 데이터를 일치 시키기 위해 사용하는 옵션 SET NULL, NO ACTION도 있음
---

2. CRUD 작업

    Create Read Update Delete 작업을 의미한다. 

    Create(생성)  
    데이터베이스에 데이터를 생성해서 넣는 작업  
    INSERT INTO [테이블명] ( [컬럼1], [컬럼2], ... ) VALUES ([값1], [값2], ... );  
    ```sql
    mysql> INSERT INTO nodejs.users (name, age, married, comment) VALUES ('hanjuren', '25', '0', '저는 한주련입니다.');
    Query OK, 1 row affected (0.01 sec)
    ```

    Read(조회)  
    데이터베이스의 데이터를 조회하는 작업  
    SELECT [컬럼], ... 또는 * FROM [테이블명] [조건]...;  
    ```sql
    mysql> SELECT * FROM USERS;
    +----+----------+-----+---------+--------------------+---------------------+
    | id | name     | age | married | comment            | created_at          |
    +----+----------+-----+---------+--------------------+---------------------+
    |  1 | hanjuren |  25 |       0 | 저는 한주련입니다. | 2021-01-11 13:52:13 |
    +----+----------+-----+---------+--------------------+---------------------+
    1 row in set (0.00 sec)
    ```
    조건을 입력해서 결과 조회.
    ```sql
    mysql> select * from users order by age desc limit 1; 
    +----+--------+-----+---------+--------------------+---------------------+
    | id | name   | age | married | comment            | created_at          |
    +----+--------+-----+---------+--------------------+---------------------+
    |  2 | 양은영 |  30 |       0 | 저는 양은영입니다. | 2021-01-11 13:53:03 |
    +----+--------+-----+---------+--------------------+---------------------+
    1 row in set (0.00 sec)
    ```

    Update(수정)  
    데이터베이스의 데이터를 수정하는 작업  
    UPDATE [테이블명] SET [컬럼명=바꿀값] WHERE [조건];  
    ```sql
    mysql> update users set age = 30 where id =2;
    Query OK, 1 row affected (0.01 sec)
    Rows matched: 1  Changed: 1  Warnings: 0
    ```

    Delete(삭제)  
    데이터베이스의 데이터를 삭제하는 작업  
    DELETE FROM [테이블명] WHERE [조건]  
    ```sql
    mysql> delete from users where id = 2;
    Query OK, 1 row affected (0.01 sec)
    ```
---

3. 시퀄라이즈 사용하기

    MYSQL작업을 쉽게 할 수 있도록 도와주는 라이브러리
    * ORM : Object Relational Mapping : 객체와 데이터를 매핑(1대1 짝지음)
    * MYSQL 외에도 다른 RDB와 호환됨
    * 자바스크립트 문법으로 데이터베이스 조작가능

    > 프로젝트 생성
    1. 프로젝트 생성
    ```js
    {
    "name": "learn-sequelize",
    "version": "0.0.1",
    "description": "시퀄라이즈를 배우자",
    "main": "app.js",
    "scripts": {
        "start": "nodemon app"
    },
    "author": "hanjuren",
    "license": "MIT",
    "dependencies": {
        "express": "^4.17.1",
        "morgan": "^1.10.0",
        "mysql2": "^2.2.5",
        "nunjucks": "^3.2.2",
        "sequelize": "^6.3.5",
        "sequelize-cli": "^6.2.0"
    },
    "devDependencies": {
        "nodemon": "^2.0.7"
    }
    }
    ```
    * sequelize-cli는 시퀄라이즈 명령어를 실행하기 위한 패키지.
    * mysql2는 MYSQL과 시퀄라이즈를 이어주는 드라이브

    2. sequelize init 호출
    ```
    npx sequelize init

    Sequelize CLI [Node: 14.15.0, CLI: 6.2.0, ORM: 6.3.5]

    Created "config\config.json"
    Successfully created models folder at "C:\Users\juren\OneDrive\바탕 화면\Node\chapter7\learn-sequelize\models".        
    Successfully created migrations folder at "C:\Users\juren\OneDrive\바탕 화면\Node\chapter7\learn-sequelize\migrations".
    Successfully created seeders folder at "C:\Users\juren\OneDrive\바탕 화면\Node\chapter7\learn-sequelize\seeders".
    ```
    호출을 하면 models, migrations, seeders, config폴더가 생성된다.

    3. models폴더의 index.js를 수정
    sequelize-cli가 자동으로 생성해주는 코드는 그대로 사용시 에러가 발생하고 필요없는 부분이 많으므로 수정한다.
    ```js
    const Sequelize = require('sequelize');

    const env = process.env.NODE_ENV || 'development';
    const config = require('../config/config')[env];
    const db = {};

    const sequelize = new Sequelize(config.database, config.username, config.password, config);

    db.sequelize = sequelize;

    module.exports = db;
    ```
    Sequelize는 시퀄라이즈 패키지이자 생성자입니다. config/config.json에서 데이터베이스 설정을 불러온 후 new Sequelize를 통해 MYSQL 연결 객체를 생성합니다. 연결 객체는 나중에 재사용을 위해 db.sequelize에 담아두었습니다.

    4. MYSQL 연결하기
    app.js 생성 후 익스프레스와 시퀄라이즈 연결
    ```js
    const express = require('express');
    const path = require('path');
    const morgan = require('morgan');
    const nunjucks = require('nunjucks');

    const { sequelize } = require('./models');

    const app = express();
    app.set('port', process.env.PORT || 3001);
    app.set('view engine', 'html');
    nunjucks.configure('views', {
        express: app,
        watch: true,
    });
    sequelize.sync({ force: false }) // force: false 실행시마다 테이블을 새로 재생성할건가에 대한 옵션 true or false
        .then(() => {
            console.log('데이터베이스 연결 성공!');
        })
        .catch((err) => {
            console.log(err);
        });

    app.use(morgan('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(express.urlencoded( { extended: false }));

    app.use((req, res, next) => { // 에러처리 미들웨어로 넘기기
        const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
        error.status = 404;
        next(error);
    });

    app.use((err, req, res, next) => { //404 에러처리 미들웨어
        res.locals.message = err.message;
        res.locals.error = precess.env.NODE_ENV != 'production' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    });

    app.listen(app.get('port'), () => {
        console.log(app.get('port'), '번 포트에서 대기중');
    });
    ```
    models/index.js에서 db.sequelize를 불러와 sync메서드를 사용해 서버 실행 시 MYSQL과 연동되도록 했습니다.

    연동시 필요한 config.json 수정
    ```json
    {
    "development": {
        "username": "root", //데이터베이스 계정 이름
        "password": "1210", // 데이터베이스 비밀번호
        "database": "nodejs", // 데이터베이스 이름
        "host": "127.0.0.1", // 데이터베이스 호스트
        "dialect": "mysql"
    },
    ...
    }
    ```

    > 실행결과
    ```
    npm start

    > learn-sequelize@0.0.1 start C:\Users\juren\OneDrive\바탕 화면\Node\chapter7\learn-sequelize
    > nodemon app

    [nodemon] 2.0.7
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node app.js`
    3001 번 포트에서 대기중
    Executing (default): SELECT 1+1 AS result
    데이터베이스 연결 성공!
    ```
---

4. 모델 정의하기

    시퀄라이즈는 기본적으로 모델이름은 단수형 테이블 이름은 복수형을 사요한다.

    > models/user.js
    ```js
    const Sequelize = require('sequelize');

    module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
            return super.init({
                name: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    unique: true,
                },
                age: {
                    type: Sequelize.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                married: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                },
                comment: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'User',
                tableName: 'users',
                paranoid: false,
                charset: 'utf8',
                coolate: 'utf8_general_ci',
            });
        }
        static associate(db) {
            db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
        }
    };
    ```
    > models/comment.js
    ```js
    const Sequelize = require('sequelize');

    module.exports = class Comment extends Sequelize.Model {
        static init(sequelize){
            return super.init({
                comment: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.NOW,
                },
            }, {
                sequelize,
                timestamps: false,
                modelName: 'Comment',
                tableName: 'comments',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
            });
        }
        static associate(db){
            db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
        }
    };
    ```

    모델은 크게 init 메서드와 static associate 메서드로 나뉜다.  
    1. super.init : 테이블에 대한 설정
    * 첫번째 인수는 테이블 컬럼에 대한 설정, 두번째 인수는 테이블 자체에 대한 설정이다.
    * 시퀄라이즈는 알아서 id를 기본키로 연결하므로 id 컬럼은 따로 적어줄 필요는 없다. MYSQL 테이블과 컬럼이 정확히 일치해야 정확하게 대응된다.  
    * 시퀄라이즈의 자료형은 MYSQL 자료형과는 조금 다르다.
       | <span style="color:orange">MySQL</sapn> | <span style="color:orange">시퀄라이즈</sapn> |
       | --- | --- |
       | VARCHAR(100) | STRING(100) | 
       | INT | INTEGER | 
       | TINYINT | BOOLEAN | 
       | DATETIME | DATE | 
       | INT UNSIGNED | INTEGER UNSIGNED | 
       | NOT NULL | allowNull : false | 
       | UNIQUE | unique: true | 
       | DEFAULT now() | dafaultValue: Sequelize.NOW |
    * 두번째 인수는 테이블 옵션
      * sequelize : static init 메서드의 매개변수와 연결되는 옵션 db.sequelize 객체를 넣어야 합니다
      * timestamps : true면 시퀄라이즈가 createdAt, updateAt 컬럼을 추가한다 false는 반대의 의미
      * underscored : 시퀄라이즈는 기본적으로 테이블명과 컬럼명을 캐멀 케이스로 만든다. 이를 스네이크 케이스로 바꾸는 옵션이다.
      * modelName : 모델이름을 설정할 수 있다. 노드 프로젝트에서 사용
      * tableName : 실제 데이터베이스의 테이블 이름이 된다. 기본적으로 모델은 단수 테이블은 복수형으로 만든다.
      * paranoid : true로 설정하면 deleteAt 컬럼이 생성 로우가 지워질때 완전히 지워지는게 아니라 지운 시각이 기록된다. 
      * cahrset, collate : 인코딩 설정

    * associate : 다른 모델과의 관계를 적는다.
      * 1 : N 관계 : hasMany, belongsTo 라는 메서드로 표현 다른 테이블에 담아줄 정보를 가지고 있는 테이블에 hasMany 다른테이블의 정보를 담아줄 테이블에는 belongsTo 메서드를 사용하면 된다. belongsTo가 있는 테이블에 컬럼이 생김
        ```js
        static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
        }
        ```
        ```js
        static associate(db){
        db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
        }
        ```
          * foreignKey : 외래키 
          * sourceKey : 다른 테이블에서 참조하고있는 키
          * targetKey : 다른 테이블에서 참조 할 키
      * 1 : 1 관계 : hasOne 메서드를 사용 
        * 예시
        ```js
        db.User.hasOne(db.Info, { foreignKey: 'UserId', sourceKey: 'id' });
        db.Info.belongsTo(db.User, { foreignKey: 'UserId', targetKey: 'id' });
        ```
        * foreignKey를 생성할 테이블을 belongsTo 메서드를 이용한다.
      * N : M 관계 : belongsToMany 메서드를 이용
        * 다대다 관계는 DB특성상 중간 테이블이 생성된다.
        ```js
        db.Post.belongsToMany(db.Hashtag, { through: 'Posthashtag' });
        db.Hashtag.belongsToMany(db.Post, { through: 'Posthashtag' });
        ```
        * 다대다 관계를 가지는 모든 테이블에 belongsToMany 메서드를 사용하며 through 로 중간 테이블을 만들어준다.

---

5. 시퀄라이즈 쿼리

    쿼리는 프로미스를 반환하므로 then을 붙여 결과값을 받을 수 있다. 또는 async/await 문법을 같이 사용할 수 있다.
    > 데이터 생성  

    SQL
    ```
    insert into nodejs.users ( name, age, married, comment ) values ('hanjuren', 25, '0', '자기소개1');
    ```
    Sequelize
    ```js
    const { User } = require('sequelize');
    User.create({
        name: 'hanjure',
        age: 25,
        married: false,
        comment: '자기소개1',
    });
    ```
    > 데이터 조회  

    1. 모든 데이터 조회 **findAll** 메서드 이용.

    ```js
    select * from nodejs.users; //sql
    User.findAll({}); //sequelize
    ```

    2. 테이블의 데이터 하나만 가져오기 **findOne** 메서드 이용.

    ```js
    select * from nodejs.users limit 1; // sql
    User.findOne({}); // sequelize
    ```

    3. 원하는 컬럼만 가져오기 **attributes** 메서드 이용.

    ```js
    select name, married from nodejs.users; // sql
    User.findAll({ // sequelize
        attributes: ['name', 'married'],
    }); 
    ```

    4. where 조건 나열 옵션

    ```js 
    select name, married from nodejs.users where married = 1 and age > 30; // sql
    const { Op } = require('sequelize'); // sequelize
    ...
    User.findAll({ 
        attributes: ['name', 'married'],
        where: {
            married: true,
            age: { [Op.gt]: 30 },
        },
    });
    ```
    시퀄라이즈의 연산자 Op객체
    * OP.gt : 초과 ' > '
    * Op.gte : 이상 ' >= '
    * Op.lt : 미만 ' < '
    * Op.lte : 이하 ' <= '
    * Op.ne : 같지않음 ' != '
    * Op.or : 또는
    * Op.in : 배열 요소 중 하나
    * Op.notIn : 배열 요소와 모두 다름
    
    Op.or 예제
    ```js
    select id, name from users where married = 0 or age > 30; //sql
    const { Op } = require('sequelize');
    ...
    User.findAll({ // sequelize
        attributes: ['id', 'name'],
        where: {
            // Op.or 속성에 OR 연산할 쿼리들을 배열로 나열
            [Op.or]: [ { married: false }, { age: { [Op.gt]: 30 } }], 
        },
    });
    ```

    5. order 옵션

    ```js
    select id, name from users order by age desc; // sql
    User.findAll({ // sequelize
        attributes: ['id', 'name'],
        order: [['age', 'desc']],
    });
    ```

    6. limit, orrset 옵션

    ```js
    select id, name from users order by age desc limit 1 offset 1; // sql
    user.fidnAll({
        attribute: ['id', 'name'],
        order: [['age', 'desc']],
        limit: 1,
        offset: 1,
    });
    ```

    7. 로우 수정

    ```js
    update nodejs.users set comment = '바꿀내용' where id = '2'; //sql
    User.update({ // sequelize
        comment: '바꿀내용', // 첫번째 인수는 수정 내용
    }, {
        where: {id: 2}, // 두번째 인수는 수정할 로우의 조건
    });
    ```

    8. 로우 삭제

    ```js
    delete from nodejs.users where id = 2; //sql
    User.destory({ // sequelize
        where: {id: 2},
    });
    ```
---

6. 관계 쿼리


    include 속성
    ```js
    const user = await User.findOne({
        include: [{
            model: Comment,
        }]
    });
    console.log(user.Comments); // 사용자 댓글
    ```
    어떤 모델과 관계가 있는지를 include에 넣어준다. include속성을 사용하는 방법 외에는 get+모델 방식이 있다.
    ```js
    const user = await User.findOne({});
    const comments = await user.getComments();
    console.log(comments); // 사용자 댓글
    ```
    관계가 설정되어있으면 getCommetns(조회), setComments(수정), addComment(하나 생성), addComments(여러개 생성), removeComments(삭제)를 지원한다. 동사 + 모델명 형식이다.

    include나 관계 쿼리 메서드에도 where, attributes를 적용할 수 있다.
    ```js
    const user = await User.findAll({
        include: [{
            model: Comment,
            where: {
                id: 1,
            },
            attributes: ['id'],
        }]
    });

    또는

    const comments = await user.getComments({
        where: {
            id: 1,
        },
        attributes: ['id'],
    });
    ```
---

    





