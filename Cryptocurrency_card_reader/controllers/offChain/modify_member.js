const addCard_Hash = require('../../models/offChain/addCardHash');
const SHA256 = require("crypto-js/sha256");

module.exports = class AddCardHash {
    addCardHash(req, res, next) {
        if(req.body.account_no == 0){
            res.json({
                err: `0為owner賬戶，新增失敗`
            })
            return;
        }
        //匯入api資料
        const data = {
            student_id: req.body.student_id,
            account_no:req.body.account_no,
            card_hash:`0x${SHA256(req.body.card_ID)}`
        };
        //res.json({data});
        addCard_Hash(data).then(result => {
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