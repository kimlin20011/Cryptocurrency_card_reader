const deploy_bank = require('../models/deploy');
const deposit = require('../models/deposit');
const transfer = require('../models/transfer');
const transfer_to_user = require('../models/transfer_to_user');
const SHA256 = require("crypto-js/sha256");

module.exports = class Modify_bank {
    //部署bank合約
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
    //存錢
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
                err: err,
            })
        })
    }

    //轉錢
    transfer(req, res, next) {
        //匯入api資料
        const data = {
            card_hash:`0x${SHA256(req.body.card_ID)}`,
            password: req.body.password,
            value :req.body.value,

        };
        transfer(data).then(result => {
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

    //轉錢
    transferToUser(req, res, next) {
        //匯入api資料
        const data = {
            //card_ID: req.body.card_ID,
            card_hash:`0x${SHA256(req.body.card_ID)}`,
            password: req.body.password,
            value :req.body.value,
        };

        transfer_to_user(data).then(result => {
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
};