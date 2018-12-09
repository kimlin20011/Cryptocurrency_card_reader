const get_Balance = require('../models/getBalance');

module.exports = class Modify_bank {
    getBalance(req, res, next) {
        //匯入api資料
        const data = {
            card_ID: req.body.card_ID,
            password: req.body.password,
        };
        get_Balance(data).then(result => {
            // 若寫入成功則回傳
            res.json({
                result: result
            })
        }, (err) => {
            // 若寫入失敗則回傳
            res.json({
                err: err
            })
        })

    }
};