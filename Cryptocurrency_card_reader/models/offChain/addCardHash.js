const db = require('../connection_db');

module.exports = function addCardHash(memberData) {
    let result = {};
    return new Promise((resolve, reject) => {
        //insert into db
        db.query('INSERT INTO member_info SET ?', memberData , function (err, rows) {
            if (err) {
                console.log(err);
                result.status = "資料庫更新失敗。";
                result.err = "伺服器錯誤，請稍後在試！";
                console.log(result);
                reject(result);
                return;
            }
            result.status = "memberData更新成功。";
            result.memberData = memberData;
            console.log(result);
            resolve(result);
        });
    });
};