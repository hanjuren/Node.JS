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





