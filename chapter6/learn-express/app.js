const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000); 
// app.set은 서버에 포트라는 속성을 3000으로 넣는다.

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html') );
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중' );
});