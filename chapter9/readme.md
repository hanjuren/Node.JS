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


multer 패키지로 이미지 업로드.

---

WEB API 서버만들기

API : Application Programming Interface 의 약자로 다른 애플리케이션에서 현재의 프로그램의 기능을 사용할 수 있게 허용하는 접점을 의미한다.

웹 API : 다른 웹 서비스의 기능을 사용하거나 자원을 가져오는 창구

JWT : JSON Web Token json 형식의 데이터를 저장하는 토큰 

* 헤더 : 토큰 종류와 해시 알고리즘 정보가 들어 있습니다.
* 페이로드 : 토큰의 내용물이 인코딩된 부분
* 시그니처: 일련의 문자열이며 시그니처를 통해 토큰이 변조되었는지 여부를 확인할 수 있다.

JWT 토큰은 내용이 포함되어있다. JWT 비밀 키를알지못하면 변조가 불가능 하기 때문에 장단점이 명확하다.