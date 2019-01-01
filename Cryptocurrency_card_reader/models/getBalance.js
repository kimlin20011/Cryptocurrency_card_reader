"use strict";
const fs = require('fs');
var Web3 = require("web3");
var web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
const config = require('../config/development_config');
const db = require('./connection_db');

module.exports =async function getBalance(_data) {

    let bank = new web3.eth.Contract(config.Bank.abi);
    //bank.options.address = config.Bank.address;
    let bankAddress=fs.readFileSync('./bank_address.txt').toString();
    console.log(bankAddress);
    bank.options.address =bankAddress;
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

    let nowAccount ="";
    await web3.eth.getAccounts((err, res) => {nowAccount = res[ac_no]});
    console.log(`nowAccount:${nowAccount}`);
    let ethBalance = await web3.eth.getBalance(nowAccount);

    return new Promise((resolve, reject) => {
        let result= {};
        bank.methods
            .getBankBalance()
            .call({
                from: nowAccount
            })
        .then((_balance) => {
            result.address= bankAddress;
            result.ethBalance= ethBalance;
            result.bankBalance=_balance;
            resolve(result);
        });
    });
};
