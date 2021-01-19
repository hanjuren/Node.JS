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


