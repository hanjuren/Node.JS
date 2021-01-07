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
