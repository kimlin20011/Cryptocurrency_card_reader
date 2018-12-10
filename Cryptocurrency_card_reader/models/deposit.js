"use strict";
const fs = require('fs');
var Web3 = require("web3");
var web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
const config = require('../config/development_config');
const unlockAccount = require('./unlock');

module.exports = async function deploy(_data) {
    let Bytecode = config.Bank.bytecode;
    let Abi = config.Bank.abi;
    //取得目前geth中第一個account
    let nowAccount ="";
    await web3.eth.getAccounts((err, res) => {nowAccount = res[0]});
    console.log(`nowAccount:${nowAccount}`);

    let password = _data.password;
    console.log(`password${password}`)
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
        let result = {};
        // 找尋
           bank.methods
                .deposit()
                .send({
                    from: nowAccount,
                    gas: 3400000,
                    value: web3.utils.toWei(_data.value, "ether")
                })
                .on("receipt", function (receipt) {
                    result.returnValues = receipt.events.DepositEvent.returnValues;
                    resolve(result);
                    // 觸發更新帳戶資料
                    //  update.trigger("click");

                    // 更新介面
                    //  doneTransactionStatus();
                })
                .on("error", function (error) {
                    reject(error.toString());
                    // 更新介面
                    //doneTransactionStatus();
                });
           bank.events.DepositEvent().on("data", function (event) {
                result.event = event;
                console.log(result);
            });

    });


};

