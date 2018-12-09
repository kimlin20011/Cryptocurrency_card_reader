"use strict";

var Web3 = require("web3");
var web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
const config = require('../../config/development_config');
const unlockAccount = require('../unlock');

module.exports =async function getBalance(_data) {

    let bank = new web3.eth.Contract(config.cc.abi);
    bank.options.address = config.Bank.address;

    let nowAccount ="";
    await web3.eth.getAccounts((err, res) => {nowAccount = res[_data.address]});
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
            resolve(CC_Address_1);
        });
    });
};
