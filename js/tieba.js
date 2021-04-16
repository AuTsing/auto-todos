const execSync = require('child_process').execSync;
const fs = require('fs');
const download = require('download');
const sct = require('./sct');

const cookie = process.env.TIEBA_COOKIE;
const url = 'https://raw.githubusercontent.com/NobyDa/Script/master/BDTieBa-DailyBonus/TieBa.js';
const sctKey = process.env.SCT_KEY;

const jsFile = './js/tieba.raw.js';
const resultFile = './result.txt';
const errFile = './err.txt';

async function prepare() {
    // await download(url, dir);
}

function generate() {
    if (!cookie) {
        throw new Error('未填写COOKIE');
    }
    let content = fs.readFileSync(`${jsFile}`, 'utf8');
    content = content.replace(/const cookieVal = '';/, `const cookieVal = '${cookie}';`);
    fs.writeFileSync(`${jsFile}`, content, 'utf8');
}

function run() {
    execSync(`node ${jsFile} >> ${resultFile}`);
}

function report() {
    if (sctKey) {
        const title = '百度贴吧';
        let content = '无执行结果';

        if (fs.existsSync(`${resultFile}`)) {
            content = fs.readFileSync(`${resultFile}`, 'utf8');
        }

        console.log(content);
        // sct.send(title, content);
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
