const axios = require('axios');

exports.send = (title, content) => {
    const sctKey = process.env.SCT_KEY;
    const api = `https://sctapi.ftqq.com/${sctKey}.send`;

    axios
        .post(api, `text=${title}&desp=${content}`)
        .then(resp => {
            // console.log(resp.data);
        })
        .catch(err => {
            console.log(err);
        });
};
