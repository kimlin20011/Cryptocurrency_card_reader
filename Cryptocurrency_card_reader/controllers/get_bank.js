const get_Balance = require('../models/getBalance');
const watch_1 = require('../models/watch');
const SHA256 = require("crypto-js/sha256");

module.exports = class Modify_bank {
    getBalance(req, res, next) {
        //匯入api資料
        const data = {
            card_hash:`0x${SHA256(req.body.card_ID)}`,
            password: req.body.password,
        };
        get_Balance(data).then(result => {
            // 若寫入成功則回傳
            res.json({
                result: result,
                state:1
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                err: err,
                info:`no card info`,
                state:0
            })
        })

    }
    watch(req, res, next) {
        //匯入api資料
        watch_1();
            res.json({
                result: `success`,
                state:1
            })
    }
};