#!/usr/bin/env node

const  { program } = require('commander');
const { version } = require('./package.json');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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

const makeTemplate = (type, name, directory) => {
    mkdirp(directory);
    if(type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if(exist(pathToFile)) {
            console.error(chalk.bold.red('이미 있는 파일 입니다.'));
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(chalk.bold.green(`${pathToFile} 생성 완료`));
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error(chalk.bold.red('이미 있는 파일 입니다.'));
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(chalk.bold.green(`${directory}/${name}.js 생성 완료`));
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

program
    .version(version, '-v, --version') // cli -v 버전 
    .name('cli'); // cli -h 사용방법 설명 

program
    .command('template <type>') // cli template html 
    .usage('<type> --filename [filename] --path [path]')
    .description('템플릿을 생성합니다.')
    .alias('tmpl')
    .option('-f, --filename [filename]', '파일명을 입력하세요', 'index')
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    .action((type, options) => {
        console.log(type, options.filename, options.directory);
        makeTemplate(type, options.filename, options.directory);

    });

program
    .command('*', { noHelp: true })
    .action( () => {
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
    });

program
    .parse(process.argv);