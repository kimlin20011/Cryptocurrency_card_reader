var express = require('express');
var router = express.Router();
const Get_bank = require('../controllers/get_bank');
const Modify_bank = require('../controllers/modify_bank');

get_bank = new Get_bank();
modify_bank = new Modify_bank();

//get_bank
router.get('/getBalance', get_bank.getBalance);

//modify_bank
router.post('/deploy', modify_bank.deployBank);
router.post('/deposit', modify_bank.deposit);

module.exports = router;
