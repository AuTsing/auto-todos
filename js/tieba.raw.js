const axios = require('axios');

const cookieVal = '';
const results = [];

const url_fetch_sign = {
    url: 'https://tieba.baidu.com/mo/q/newmoindex',
    headers: {
        'Content-Type': 'application/octet-stream',
        Referer: 'https://tieba.baidu.com/index/tbwise/forum',
        Cookie: 'BDUSS=' + cookieVal,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16A366',
    },
};
const url_fetch_add = {
    url: 'https://tieba.baidu.com/sign/add',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: 'BDUSS=' + cookieVal,
        'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X; zh-CN) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/14B100 UCBrowser/10.7.5.650 Mobile',
    },
    data: '',
};

signTieBa();

function signTieBa() {
    return new Promise((resolve, reject) => {
        if (!cookieVal) {
            reject('未获取到COOKIE');
        } else {
            return resolve();
        }
    })
        .then(() => axios.request(url_fetch_sign))
        .then(
            resp => {
                const data = resp.data;
                const isSuccessResponse = data && data.no == 0 && data.error == 'success' && data.data.tbs;
                if (!isSuccessResponse) {
                    return Promise.reject(data && data.error ? data.error : '接口数据获取失败');
                }
                if (data.data.like_forum.length <= 0) {
                    return Promise.reject('未获取到要签到的贴吧');
                }
                return data.data;
            },
            err => {
                return Promise.reject('获取签到列表失败');
            }
        )
        .then(async data => {
            const bars = data.like_forum;
            const tbs = data.tbs;
            for (const bar of bars) {
                if (bar.is_sign == 1) {
                    results.push({
                        bar: bar.forum_name,
                        status: '已签到',
                    });
                } else {
                    await signBar(bar, tbs);
                }
            }
        })
        .then(() => {
            results.forEach(result => console.log(`贴吧:${result.bar} ${result.status}`));
            const succeeded = results.filter(result => result.status === '已签到' || result.status === '签到成功').length;
            console.log(`签到成功 ${succeeded}/${results.length}`);
        })
        .catch(err => {
            console.log('签到失败 ' + err);
        });
}

function signBar(bar, tbs) {
    url_fetch_add.data = `tbs=${tbs}&kw=${bar.forum_name}&ie=utf-8`;
    return axios
        .request(url_fetch_add)
        .then(resp => {
            if (resp.no == 0) {
                process.result.push({
                    bar: bar.forum_name,
                    status: '签到成功',
                });
            } else {
                process.result.push({
                    bar: bar.forum_name,
                    status: resp.error,
                });
            }
        })
        .catch(err => {
            results.push({
                bar: bar.forum_name,
                status: '签到失败,接口错误',
            });
        });
}
