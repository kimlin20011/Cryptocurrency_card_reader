"use strict";

var Web3 = require("web3");
var web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

module.exports = async function unlockAccount(nowAccount,password) {

    console.log(`nowAccount: ${nowAccount} `);

    return web3.eth.personal
        .unlockAccount(nowAccount, password, 100)
        .then(function(result) {
            console.log("account已解鎖");
            return true;
        })
        .catch(function(err) {
            console.log("account密碼輸入錯誤");
            return false;
        });
};