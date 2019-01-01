var express = require('express');
var router = express.Router();
const Modify_member = require('../controllers/offChain/modify_member');

modify_member = new Modify_member();


router.post('/offChain/addMember', modify_member.addCardHash);



module.exports = router;
