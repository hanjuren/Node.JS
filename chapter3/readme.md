# Chapter3. 노드내장 객체
1. global
   
    브라우저의 window와 같은 전역 객체이다.
    
    *** 
    > globalA.js
    ```js
    module.exports = () => globalThis.message;
    ```
    > globalB.js
    ```js
    const A = require('./globalA');  
    global.message = '안녕하세요.';  
    console.log(A());   
    ```
    > 콘솔
    ```
    node chapter3/globalB
    안녕하세요.
    ```
    주의점
    > global 객체의 속성에 값을 대입하여 파일간 공유가 가능하지만 프로그램의 규모가 커질수록 객체에 어떤 값을 대입했는지 찾기 힘들어져 유지보수가 어려워지므로 모듈 형식으로 만들어 명시적으로 값을 불러와 사용하는 것이 바람직하다.

2. console
   
   global 객체 안에 들어있으며 보통 디버깅을 위해 사용한다.
   ###### 여러가지 로그들
   ***
   > console.js 
    ```js
    const string = 'abc';  
    const number = 1;  
    const boolean = true;  
    const obj = {
    outside: {   
        inside: {  
            key: 'value',  
            },  
        },  
    };  
    console.time('전체 시간');
    console.log('평범한 로그입니다 쉼표로 구분해 여러 값을 찍을 수 있습니다.');
    console.log(string , number, boolean);
    console.error('에러 메시지는 console.error에 담아주세요.');
    console.table([{ name: 'juren', birth: 1997}, {name: 'juyeol', birth: 2000}]);
    
    console.dir(obj, { colors: false, depth: 2 });
    console.dir(obj, { colors: true, depth: 1 });
    
    console.time('시간 측정');
    for (let i = 0; i < 100000; i++) {}
    console.timeEnd('시간 측정');
    
    function b() {
        console.trace('에러 위치 추적');
    }
    function a(){
        b();
    }

    a();

    console.timeEnd('전체 시간');
    ```
   * consol.time(레이블) : console.timeEnd()와 대응되어 같은 레이블을 가진 time과 timeEnd사이의 시간을 측정
   * console.log(내용) : 일반적인 로그를 콘솔에 표시
   * console.error(에러) : 에러를 콘솔에 표시
   * console.table(배열) : 객체의 속성들이 테이블 형식으로 표현
   * console.dir(객체, 옵션) : 객체를 콘솔에 표시할때 사용
   * console.trace(레이블) : 에러위치를 추적

   > 결과 
    ```
    node chapter3/console.js
    평범한 로그입니다 쉼표로 구분해 여러 값을 찍을 수 있습니다.
    abc 1 true
    에러 메시지는 console.error에 담아주세요.
    ┌─────────┬──────────┬───────┐
    │ (index) │   name   │ birth │
    ├─────────┼──────────┼───────┤
    │    0    │ 'juren'  │ 1997  │
    │    1    │ 'juyeol' │ 2000  │
    └─────────┴──────────┴───────┘
    { outside: { inside: { key: 'value' } } }
    { outside: { inside: [Object] } }
    시간 측정: 5.797ms
    Trace: 에러 위치 추적
        at b (C:\Users\juren\OneDrive\바탕 화면\Node.js\chapter3\console.js:27:13)
        at a (C:\Users\juren\OneDrive\바탕 화면\Node.js\chapter3\console.js:30:5)
        at Object.<anonymous> (C:\Users\juren\OneDrive\바탕 화면\Node.js\chapter3\console.js:33:1)
        at Module._compile (internal/modules/cjs/loader.js:1063:30)
        at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
        at Module.load (internal/modules/cjs/loader.js:928:32)
        at Function.Module._load (internal/modules/cjs/loader.js:769:14)
        at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
        at internal/main/run_main_module.js:17:47
    전체 시간: 169.601ms
    ```
---
# 노드의 내장 모듈
1. os


    운영체제의 정보를 가져올수있다.

    > os.js
    ```js   
    const os = require('os');

    console.log('운영체제 정보 -------------------------');
    console.log('os.arch() :', os.arch());
    console.log('os.platform() :', os.platform());
    console.log('os.type() :', os.type());
    console.log('os.uptime() :', os.uptime());
    console.log('os.hostname() :', os.hostname());
    console.log('os.release() :', os.release());

    console.log('경로---------------------------');
    console.log('os.homedir() :', os.homedir());
    console.log('os.tmpdir() :', os.tmpdir());

    console.log('cpu 정보----------------------');
    console.log('os.cups() :', os.cpus());
    console.log('os.cups().length :', os.cpus().length);

    console.log('메모리 정보----------------');
    console.log('os.freemem() :', os.freemem());
    console.log('os.totalmem() :', os.totalmem());
    ```
    > 결과
    ```
    운영체제 정보 -------------------------
    os.arch() : x64
    os.platform() : win32
    os.type() : Windows_NT
    os.uptime() : 151875
    os.hostname() : DESKTOP-B1482QB
    os.release() : 10.0.19041
    경로---------------------------
    os.homedir() : C:\Users\juren
    os.tmpdir() : C:\Users\juren\AppData\Local\Temp
    cpu 정보----------------------
    os.cups() : [
    {
        model: 'AMD Ryzen 5 4500U with Radeon Graphics         ',
        speed: 2371,
        times: {
        user: 2523812,
        nice: 0,
        sys: 1302281,
        idle: 29988125,
        irq: 169796
        }
    },
    {
        model: 'AMD Ryzen 5 4500U with Radeon Graphics         ',
        speed: 2371,
        times: {
        user: 2517828,
        nice: 0,
        sys: 1021671,
        idle: 30274484,
        irq: 27250
        }
    },
    {
        model: 'AMD Ryzen 5 4500U with Radeon Graphics         ',
        speed: 2371,
        times: { user: 2609187, nice: 0, sys: 819031, idle: 30385765, irq: 12906 }
    },
    {
        model: 'AMD Ryzen 5 4500U with Radeon Graphics         ',
        speed: 2371,
        times: { user: 2971828, nice: 0, sys: 956234, idle: 29885921, irq: 20109 }
    },
    {
        model: 'AMD Ryzen 5 4500U with Radeon Graphics         ',
        speed: 2371,
        times: {
        user: 3149265,
        nice: 0,
        sys: 1207140,
        idle: 29457578,
        irq: 18640
        }
    },
    {
        model: 'AMD Ryzen 5 4500U with Radeon Graphics         ',
        speed: 2371,
        times: { user: 3708140, nice: 0, sys: 747062, idle: 29358781, irq: 22734 }
    }
    ]
    os.cups().length : 6
    메모리 정보----------------
    os.freemem() : 11135414272
    os.totalmem() : 16533356544
    ```
---
2. 파일시스템 접근 모듈

    > readFile.js
    ```js
    const fs = require('fs').promises;

    fs.readFile('./readame.txt')
        .then((data) => {
            console.log(data);
            console.log(data.toString());
        })
        .catch((err) => {
            console.log(err);
        });
    ```
    > 결과
    ```
    node readFile.js
    <Buffer ec 9d bd ea b8 b0 20 ec a0 84 ec 9a a9 20 ed 8c 8c ec 9d bc 2e 2e 2e>
    읽기 전용 파일...
    ```
    >writeFIle.js
    ```js
    const fs = require('fs').promises;

    fs.writeFile('./writeme.txt', '새로 만든 파일...')
        .then(() => {
            return fs.readFile('./writeme.txt');
        })
        .then((data) => {
            console.log(data.toString());
        })
        .catch((err) => {
            console.log(err);
        });
    ```
    > 결과
    ```   
    node writeFile.js
    새로 만든 파일...
    ```
---
3. 동기와 비동기, 블로킹과 논 블로킹
    
    * 동기와 비동기 : 백그라운드 작업완료 확인 여부
    * 블로킹과 논블로킹 : 함수가 바로 return되는지 여부  

    노드는 동기-블로킹 방식과 비동기-논 블로킹 방식이 대부분이다.  
    동기-블로킹 방식에서는 백그라운드 작업 여부를 계속 확인하며 호출한 함수가 바로 return 되지 않고 백그라운드 작업이 끝나야 return 된다. 비동기-논 블로킹 방식에서는 호출한 함수가 바로 return되어 다음 작업으로 넘어가며 백그라운드 작업 완료 여부는 신경쓰지 않고 나중에 백그라운드가 알림을 줄떄 처리한다.
---
4. 버퍼
    
    파일을 읽거나 쓰는 방식에는 버퍼, 스트림을 이용하는 두가지 방식이 있다.

- 버퍼를 다뤄보는 예제
    > buffer.js
    ```js
        const buffer = Buffer.from('버퍼로 바꿔보세요.');
        console.log('from() : ', buffer);
        console.log('length() : ',buffer.length);
        console.log('toString() :', buffer.toString());

        const array = [Buffer.from('띄엄 '), Buffer.from('띄엄 '), Buffer.from('띄어쓰기')];
        const buffer2 = Buffer.concat(array);
        console.log('concat() :', buffer2.toString());

        const buffer3 = Buffer.alloc(5);
        console.log('alloc() :', buffer3);
    ```    

    > 결과

    ```
        node chapter3/buffer.js
        from() :  <Buffer eb b2 84 ed 8d bc eb a1 9c 20 eb b0 94 ea bf 94 eb b3 b4 ec 84 b8 ec 9a 94 2e>
        length() :  26
        toString() : 버퍼로 바꿔보세요.
        concat() : 띄엄 띄엄 띄어쓰기
        alloc() : <Buffer 00 00 00 00 00>
    ```

  * from(문자열) : 문자열을 버퍼로 변환 length속성은 버퍼의 크기를 알려주며 단위는 바이트 단위이다.
  * toString(버퍼) : 버퍼를 다시 문자열로 바꿔준다.
  * concat(배열) : 배열 안에 든 버퍼들을 하나로 합친다.
  * alloc(바이트) : 비어있는 버퍼를 생성 바이트를 인수로 넣으면 해당 크기의 버퍼가 생성된다.  
---  

5. 파일을 읽는 스트림 메서드는 createRedeStream이 있다.

    > createReadStream.js

    ```js
    const fs = require('fs');

    const readStream = fs.createReadStream('./chapter3/readame.txt', {highWaterMark: 16});
    const data = [];

    readStream.on('data', (chunk) => {
        data.push(chunk);
        console.log('data :', chunk, chunk.length);
    });
    readStream.on('end', () =>{
        console.log('end :', Buffer.concat(data).toString());
    });

    readStream.on('error', (err) => {
        console.log('error :', err);
    });
    ```
    > 결과
    ```
    node chapter3/createReadstream.js
    data : <Buffer ec a0 80 eb 8a 94 20 ec a1 b0 ea b8 88 ec 94 a9> 16
    data : <Buffer 20 eb 82 98 eb 88 a0 ec 84 9c 20 ec a0 84 eb 8b> 16
    data : <Buffer ac eb 90 a9 eb 8b 88 eb 8b a4 2e 20 eb 82 98 eb> 16
    data : <Buffer 88 a0 ec a7 84 20 ec a1 b0 ea b0 81 ec 9d 84 20> 16
    data : <Buffer 63 68 75 6e 6b eb 9d bc ea b3 a0 20 eb b6 80 eb> 16
    data : <Buffer a6 85 eb 8b 88 eb 8b a4 2e> 9
    end : 저는 조금씩 나눠서 전달됩니다. 나눠진 조각을 chunk라고 부릅니다.
    ```

6. 스레드풀 
    > threadpool.js
    ```js
    const crypto = require('crypto');

    const pass = 'pass';
    const salt = 'salt';
    const start = Date.now();

    crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
        console.log('1:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt, 1000000, 128, 'sha512', () => {
        console.log('2:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt,1000000, 128, 'sha512', () => {
        console.log('3:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt,1000000, 128, 'sha512', () => {
        console.log('4:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt,1000000, 128, 'sha512', () => {
        console.log('5:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt,1000000, 128, 'sha512', () => {
        console.log('6:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt,1000000, 128, 'sha512', () => {
        console.log('7:', Date.now() - start);
    });
    crypto.pbkdf2(pass, salt,1000000, 128, 'sha512', () => {
        console.log('8:', Date.now() - start);
    });
    ```
    > 결과
    ```
    4: 2075
    1: 2084
    2: 2176
    3: 2194
    8: 4210
    5: 4286
    7: 4335
    6: 4513
    ```
---
7. 이벤트

    >event.js
    ```js
    const EventEmitter = require('events');

    const myEvent = new EventEmitter();
    myEvent.addListener('event1', () => {
        console.log('1번 이벤트 실행');
    });
    myEvent.on('event2', () => {
        console.log('2번 이벤트 실행');
    });
    myEvent.on('event2', () => {
        console.log('2번이벤트 추가');
    });
    myEvent.once('event3', () => {
        console.log('3번 이벤트는 한번만 실행됩니다.');
    });

    myEvent.emit('event1'); //이벤트 호출
    myEvent.emit('event2'); //이벤트 호출
    myEvent.emit('event3'); //이벤트 호출
    myEvent.emit('event3'); //호출안됨

    myEvent.on('event4', () => {
        console.log('이벤트 4');
    });
    myEvent.removeAllListeners('event4'); //이벤트 삭제
    myEvent.emit('event4');

    console.log(myEvent.listenerCount('event2'));
    ```
    > 결과
    ```
    1번 이벤트 실행
    2번 이벤트 실행
    2번이벤트 추가
    3번 이벤트는 한번만 실행됩니다.
    2
    ```
    * on(이벤트명, 콜백) : 이벤트 이름과 이벤트 발생시의 콜백을 연결 이벤트 리스닝이라고 부른다.
    * addListener(이벤트명, 콜백) : on과 기능이 같다.
    * emit(이벤트명) : 이벤트를 호출하는 메서드 이벤트의 이름을 인수로 넣는다.
    * once(이벤트명, 콜백) : 이벤트를 한번만 실행
    * removeAllListeners(이벤트명) : 이벤트에 연결된 모든 이벤트 리스너를 제거
    * removeListener(이벤트명, 리스너) : 이벤트에 연결된 리스너를 하나씩 제거
    * listenerCount(이벤트명) : 이벤트의 리스너가 몇개 연결되어있는지 확인

8. 에러
   
   > 자주 발생하는 에러
   * *node: command not found* : 노드를 설치했지만 환경변수가 제대로 설정되지 않음
   * *RefernceError: 모듈 is not defined* : 모듈을 require했는지 확인
   * *Error: Cannot find module 모듈명* : 모듈을 require했지만 설치하지 않음
   * *Error: Can't set headers after they are sent* : 요청에 대한 응답을 보낼때 두번이상 보냄
   * *FATAL ERROR : CALL_AND_RETRY_LAST Allocation failed - javaScript heap out of memory* : 코드를 실행할 때 메모리가 부족하여 정상적으로 작동하지 않는 경우 
   * *UnhandledPromiseRejectionwaring: Unhandle promise rejection* : 프로미스 사용시 catch메서드를 사용하지 않으면 나오는 에러

    > 3장 자료
    * 노드 공식 문서 : https://nodejs.org/dist/latest-v15.x/docs/api/
    * 에러 코드 : https://nodejs.org/dist/latest-v15.x/docs/api/errors.html