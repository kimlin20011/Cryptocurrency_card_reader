"use strict";
//轉賬給店家
const fs = require('fs');
var Web3 = require("web3");
var web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
const config = require('../config/development_config');
const unlockAccount = require('./unlock');
const db = require('./connection_db');

module.exports = async function transfer(_data) {
    //let Bytecode = config.Bank.bytecode;
    let Abi = config.Bank.abi;
//取得目前geth中第一個account
    let nowAccount ="";
    let ownerAccount="";
    await db.query('SELECT account_no FROM member_info WHERE card_hash = ?', _data.card_hash, function (err, rows) {
        if (err) {
            console.log(err);
            console(err);
            return;
        }
        //檢查有無卡片資料
        if(rows.length < 1){
            console.log(`length:${rows.length}`);
            return;
        }
        console.log(`length:${rows.length}`);
        ac_no = rows[0].account_no;
        console.log(`no:${ac_no}`);
    });
    let ac_no;//?
    await web3.eth.getAccounts((err, res) => {
        nowAccount = res[ac_no];
        ownerAccount = res[0];
    });
    console.log(`nowAccount:${nowAccount}`);

    let password = _data.password;
    console.log(`password${password}`);
    let bank = new web3.eth.Contract(Abi);
    let bankAddress=fs.readFileSync('./bank_address.txt').toString();
    console.log(bankAddress);
    bank.options.address =bankAddress;

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        console.log(`unlock失敗`);
        return;
    }


    return new Promise((resolve, reject) => {
        bank.methods
            .transfer(ownerAccount, _data.value)
            .send({
                from: nowAccount,
                gas: 3400000
            })
            .on("receipt", function (receipt) {
                resolve(receipt.events.TransferEvent.returnValues);
            })
            .on("error", function (error) {
                reject(error.toString());

            });
    });
};