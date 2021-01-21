# Chapter9. 익스프레스 SNS서비스 만들기

사용할 패키지
* express
* express-session
* morgan
* multer
* sequelize
* sequelize-cli
* mysql2
* nodemon
* cookie-parser
* dotenv
* nunjucks

라우터
* GET /profile
* GET /join
* GET /

데이터베이스 세팅
* users  
사용자정보를 저장 이메일 닉네임 비밀번호를 저장 , SNS로그인시 provider, snsId를 저장 기본 previder는 'local'로 지정

|user table|||||
|:---:|:---:|:---:|:---:|:---:|
||type|allowNull|unique|defaultValue|
|email|String|true|true||
|nick|String|false|||
|password|String|fase||local|
|snsId|String|true|||

* posts  
게시글 내용과 이미지 저장

|post table|||
|:---:|:---:|:---:|
||type|allowNull|
|content|String|false|
|img|String|true|

* hashtags  
해시태그 이름 저장(태그로 검색기능 제공)

|hashtag table||||
|:---:|:---:|:---:|:---:|
||type|allowNull|unique|
|title|String|false|true|

테이블관계

사용자 테이블 1 : N 게시글 테이블

게시글 테이블 N : M 해시태그 테이블 (하나의 게시글은 여러개의 해시태그, 해시태그는 여러개의 게시글 )
 
사용자 테이블 N : M 사용자 테이블 (팔로잉 팔로워 관계)

---

로그인 구현(passport)

로그인 과정

1. 라우터를 통해 로그인 요청이 들어온다.
2. 라우터에서 passport.authenticate 메서드를 호출
3. 로그인 전략 수행
4. 로그인 성공시 자숑자 정보 객체와 req.login 호출
5. req.login 메서드가 passport.serializeUser 호출
6. req.session에 사용자의 아이디만 저장
7. 로그인 완료

done함수는 인자를 3개를 받는다.


done(null, user) or done(null, false, {message: '실패'})
1. 서버 에러 (null)
2. 성공한경우 
3. 실패할때 메시지