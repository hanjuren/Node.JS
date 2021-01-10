# npm이란

1. npm

    * 노드의 패키지 매니저
    * 다른 사람들이 만든 소스 코드들을 모아둔 저장소
    * 다른 사람들의 코드를 이용하여 프로그래밍 가능
    * 이미 있는 기능을 다시 구현할 필요가 없어 효율적
    * 오픈 소스 생태계를 구성중
    * 패키지 : npm에 업로드된 노드 모듈
    * 모듈이 다른 모듈을 사용할 수 있듯 패키지도 다른 패키지를 사용할 수 있다.
    * 의존 관계라고 부른다.
---
2. package.json

    현재 프로젝트에 대한 정보와 사용중인 패키지에 대한 정보를 담은 파일.  
    노드 프로젝트를 시작하기 전에는 항상 package.json파일을 만들고 시작해야한다.

    #### npm 프로젝트 생성

    > 콘솔
    ```
    npm init
    This utility will walk you through creating a package.json file.
    It only covers the most common items, and tries to guess sensible defaults.

    See `npm help init` for definitive documentation on these fields
    and exactly what they do.

    Use `npm install <pkg>` afterwards to install a package and
    save it as a dependency in the package.json file.

    Press ^C at any time to quit.
    package name: (publish) npmtest [프로젝트 이름 입력]
    version: (1.0.0) [프로젝트 버전 입력]
    description: [프로젝트 설명 입력]
    entry point: (index.js) [시작점]
    test command: [엔터키 클릭]
    git repository: [엔터키 클릭]
    keywords: [엔터키 클릭]
    author: hanjuren [작성자 입력]
    license: (ISC) MIT [라이센스 입력]
    About to write to C:\Users\juren\OneDrive\바탕 화면\Node\chapter5\publish\package.json:

    {
    "name": "npmtest",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "hanjuren",
    "license": "MIT"
    }


    Is this OK? (yes) yes
    ```
    * package name : 패키지의 이름입니다. package.json의 name속성에 저장됩니다.
    * version : 패키지의 버전입니다. 
    * entry point : 자바스크립트 실행 파일 진입점입니다. 보통 마지막으로 module.exprots를 하는 파일을 지정합니다.
    * test command : 코드를 테스트할때 입력할 명령어를 의미합니다. 
    * git repository : 코드를 저장해둔 깃 저장소 주소를 의미합니다. 소스에 문제가 생겼을때 문제를 제기하거나 코드 수정본을 올릴 수 있습니다.
    * kewords : 키워드는 npm공식 홈페이지에서 패키지를 쉽게 찾을 수 있도록 해줍니다.
    * license : 해당 패키지의 라이선스를 넣으면 됩니다.
    
    > package.json
    ```json
    {
    "name": "npmtest",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node index"
    },
    "author": "hanjuren",
    "license": "MIT"
    }
    ```

    npm 설치

    npm install [패키지이름] 또는 npm install [패키지1] [패키지2] 로 설치가 가능하다.
    설치된 패키지는 package.json파일에 저장된다

    ```json
    ...
    "dependencies": {
    "cookie-parser": "^1.4.5",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "morgan": "^1.10.0"
    }
    ```
    개발용 패키지 설치  
    npm install --save-dev [패키지] [...]로 설치합니다.

    ```
    npm install -D nodemon //-D는 --save-dev의 약자.
    ```
    ```json
    "devDependencies": {
    "nodemon": "^2.0.7" //소스코드가 바뀔때마다 자동으로 노드를 재실행 해주는 개발용 패키지.
    }
    ```
    전역 설치  
    npm install -g [패키지] [...]로 설치합니다.  
    글로벌 설치의 단점은 package.json에 기록이 안되서 프로젝트 관리가 바뀔때 패키지 관리가 불편하다.  
    그래서 package.json에 기록 후 npx 명령어를 사용하여 전역설치한 것과 같은 효과를 얻을 수 있고 버전관리에도 용이 하다.
---
3. npm 기타 명령어

    * npm outdated : 어떤 패키지에 기능 변화가 생겼는지 확인
    * npm uninstall : 패키지 삭제(npm rm 패키지명으로도 가능)
    * npm search : 패키지를 검색할 수 있음
    * npm info : 패키지의 세부정보 확인 가능
    * npm adduser : npm에 로그인을 하기 위한 명령어
    * npm whoami : 현재 사용자가 누구인지 알려줌
    * npm logout : 로그인한 계정을 로그아웃
    * npm version 버전 : package.json의 버전을 올림
    * npm publish : 패키지 배포
    * npm unpublish [패키지] --force : 배포한 패키지 삭제