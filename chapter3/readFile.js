const fs = require('fs').promises;

fs.readFile('./chapter3/readame.txt')
    .then((data) => {
        console.log(data);
        console.log(data.toString());
    })
    .catch((err) => {
        console.log(err);
    });