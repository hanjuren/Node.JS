#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

let rl;
let type = process.argv[2]
let name = process.argv[3]
let directory = process.argv[4] || '.';

const htmlTemplate = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8" />
            <title>Template</title>
        </head>
        <body>
            <h1>Hello</h1>
            <p>CLI</p>
        </body>
    </html>
`;

const jsonTemplate = `
{
    "name": "node-cli",
    "version": "0.0.1",
    "description": "nodejs cli program",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "juren",
    "license": "MIT",
    "bin": {
        "cli": "./template.js"
    }
}
`;


const routerTemplate = `
    const express = require('express');
    const router = express.Router();

    router.get('/', (req, res, next) => {
        try {
            res.send('ok');
        } catch(error) {
            console.error(error);
            next(error);
        }
    });

    module.exports = router;
`;

const exist = (dir) => {
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK); // 권한
        return true;
    } catch(e) {
        return false;
    }
};

const mkdirp = (dir) => {
    const dirname = path
        .relative('.', path.normalize(dir))
        .split(path.sep) //path.sep 의미 .후행 디렉토리 구분 기호는 무시
        .filter(p => !!p);
    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx+1).join(path.sep);
        if(!exist(pathBuilder)) {
            fs.mkdirSync(pathBuilder);
        }
    });
};

const makeTemplate = () => {
    mkdirp(directory);
    if(type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if(exist(pathToFile)) {
            console.error('이미 있는 파일 입니다.');
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(`${pathToFile} 생성 완료`);
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error('이미 있는 파일 입니다.');
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(`${directory}/${name}.js 생성 완료`);
        }
    } else if (type === 'json') {
        const pathToFile = path.join(directory, `${name}.json`);
        if(exist(pathToFile)) {
            console.error('이미 있는 파일입니다.');
        } else {
            fs.writeFileSync(pathToFile, jsonTemplate);
            console.log('성공');
        }
    } else {
        console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
    }
};

// const program = () => {
//     if (!type || !name) {
//         console.error('사용 방법 : cli html||express-router 파일명 [생성 경로]');
//     } else {
//         makeTemplate();
//     }
// };

const dirAnswer = (answer) => {
    directory = (answer && answer.trim()) || '.';
    rl.close();
    makeTemplate();
};

const nameAnswer = (answer) => {
    if(!answer || !answer.trim()) {
        console.clear();
        console.log('name은 반드시 입력하셔야 합니다.');
        return rl.question('파일명을 입력하세요. ', nameAnswer);
    }
    name = answer;
    return rl.question('저장할 경로를 입력해주세요 (기본값은 현재 경로) ', dirAnswer);
};

const typeAnswer = (answer) => {
    if(answer !== 'html' && answer !== 'express-router' && answer !== 'json' && !answer.trim()) {
        console.clear();
        console.log('html, express-router, json 파일형식만 지원 합니다.');
        return rl.question('어떤 템플릿이 필요하십니까? ', typeAnswer);
    }
    type = answer;
    return rl.question('파일명을 입력하세요. ', nameAnswer);
};

const program = () => {
    if(!type || !name) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        console.clear();
        rl.question('어떤 템플릿이 필요하십니까? ', typeAnswer);
    } else {
        makeTemplate();
    }
};

program();