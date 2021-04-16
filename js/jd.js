const execSync = require('child_process').execSync;
const fs = require('fs');
const download = require('download');
const sct = require('./sct');

const cookie = process.env.JD_COOKIE;
const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js';
const sctKey = process.env.SCT_KEY;

const dir = './tmp/';
const jsFile = 'JD_DailyBonus.js';
const resultFile = 'result.txt';
const errFile = 'err.txt';

async function prepare() {
    await download(url, dir);
}

function generate() {
    if (!cookie) {
        throw new Error('未填写COOKIE');
    }
    let content = fs.readFileSync(`${dir}${jsFile}`, 'utf8');
    content = content.replace(/var Key = ''/, `var Key = '${cookie}'`);
    fs.writeFileSync(`${dir}${jsFile}`, content, 'utf8');
}

function run() {
    execSync(`node ${dir}${filename} >> ${dir}${resultFile}`);
}

function report() {
    if (sctKey) {
        const title = '京东';
        let content = '无执行结果';

        if (fs.existsSync(result_path)) {
            content = fs.readFileSync(`${dir}${resultFile}`, 'utf8');
        }

        sct.send(title, content);
    }
}

async function main() {
    try {
        await prepare();
        console.log('下载完成');

        generate();
        console.log('配置完成');

        run();
        console.log('执行完成');

        report();
        console.log('汇报完成');
    } catch (err) {
        console.log(err);
    }
}

main();
