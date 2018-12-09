"use strict";
const fs = require('fs');
var Web3 = require("web3");
var web3 = new Web3;
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
const config = require('../../config/development_config');
const unlockAccount = require('../unlock');

module.exports = async function deploy(_data) {
    let Bytecode = config.MC.bytecode;
    let Abi = config.MC.abi;
//取得目前geth中第一個account
    let nowAccount ="";
    await web3.eth.getAccounts((err, res) => {nowAccount = res[0]});
//let accounts =await web3.eth.getAccounts();
    console.log(`nowAccount:${nowAccount}`);

    let password = _data.password;
    let bank = new web3.eth.Contract(Abi);

    // 解鎖
    let unlock = await unlockAccount(nowAccount,password);
    if (!unlock) {
        return;
    }

    return new Promise((resolve, reject) => {
        // 找尋
        bank
            .deploy({
                data: Bytecode
            })
            .send({
                from: nowAccount,
                gas: 4400000
            })
            .on('error', function(error){
                reject(`部署失敗${error}`);
            })
            .on("receipt", function(receipt) {
                console.log(receipt);
                // 更新合約介面
                let bank_Address = receipt.contractAddress;
                //將新生成的mc地址寫進.txt檔案
                fs.writeFileSync('./MC_address.txt', bank_Address);
                resolve(`合約地址:${bank_Address}`);
            })
    });

};

