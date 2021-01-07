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