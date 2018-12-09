const deploy_bank = require('../models/deploy');
const deposit = require('../models/deposit');

module.exports = class Modify_bank {
    deployBank(req, res, next) {
        //匯入api資料
        const data = {
            password: req.body.password,
        };
        deploy_bank(data).then(result => {
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

    deposit(req, res, next) {
        //匯入api資料
        const data = {
            password: req.body.password,
            value :req.body.value,
        };
        deposit(data).then(result => {
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