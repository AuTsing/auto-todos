const axios = require('axios');

const cookieVal = '';
const process = {
    total: 0,
    result: [
        // {
        //     bar:'',
        //     level:0,
        //     exp:0,
        //     errorCode:0,
        //     errorMsg:''
        // }
    ],
};
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
    if (!cookieVal) {
        console.log('贴吧签到', '签到失败', '未获取到cookie');
        return;
    }
    axios
        .request(url_fetch_sign)
        .then(
            resp => {
                const data = resp.data;
                const isSuccessResponse = data && data.no == 0 && data.error == 'success' && data.data.tbs;
                console.log(resp);
                if (!isSuccessResponse) {
                    return Promise.reject(['贴吧签到', '签到失败', resp && resp.error ? resp.error : '接口数据获取失败']);
                }
                process.total = resp.data.like_forum.length;
                if (resp.data.like_forum && resp.data.like_forum.length > 0) {
                    return resp.data;
                } else {
                    return Promise.reject(['贴吧签到', '签到失败', '请确认您有关注的贴吧']);
                }
            },
            err => {
                return Promise.reject(['贴吧签到', '签到失败', '未获取到签到列表']);
            }
        )
        .then(async data => {
            const bars = data.like_forum;
            const tbs = data.tbs;
            for (const bar of bars) {
                if (bar.is_sign == 1) {
                    process.result.push({
                        bar: `${bar.forum_name}`,
                        level: bar.user_level,
                        exp: bar.user_exp,
                        errorCode: 9999,
                        errorMsg: '已签到',
                    });
                } else {
                    await signBar(bar, tbs);
                }
            }
        })
        .then(() => {
            console.log('贴吧签到', '签到已满', `${process.result.length}`);
        })
        .catch(err => {
            console.log(err);
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
                    errorCode: 0,
                    errorMsg: `获得${resp.data.uinfo.cont_sign_num}积分,第${resp.data.uinfo.user_sign_rank}个签到`,
                });
            } else {
                process.result.push({
                    bar: bar.forum_name,
                    errorCode: resp.no,
                    errorMsg: resp.error,
                });
            }
        })
        .catch(err => {
            process.result.push({
                bar: bar.forum_name,
                errorCode: 999,
                errorMsg: '接口错误',
            });
        });
}
