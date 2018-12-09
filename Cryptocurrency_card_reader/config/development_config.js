const fs = require('fs');
require('dotenv').config();
//const Bank_address = fs.readFileSync('./bank_address.txt').toString();


//讀進合約abi,bytecode
const BankAbi = JSON.parse(fs.readFileSync('./contracts/Bank_sol_Bank.abi').toString());
const BankBytecode = '0x' + fs.readFileSync('./contracts/Bank_sol_Bank.bin').toString();

module.exports ={
    mysql: {
        host: process.env.HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    },
    Bank: {
        abi: BankAbi,
        bytecode: BankBytecode,
        //address:Bank_address
    },
/*    geth: {
        //account: nowAccount,
        //暫時不用
        account:'0x8424dfd424a731ebefc1dbba373dc678430acf0b',
        password: process.env.password
    }*/
};