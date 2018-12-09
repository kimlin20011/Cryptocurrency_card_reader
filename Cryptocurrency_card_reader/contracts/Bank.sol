pragma solidity ^0.4.23;
//下指令編譯新合約 solcjs -o ./ --bin --abi Bank.sol
contract Bank {
    // 此合約的擁有者
    address private owner;

    // 儲存所有會員的餘額
    mapping (address => uint256) private balance;

    struct CertificateDepositInfo{
        uint period;
        uint value;
    }

    // 儲存所有會員的定存時間
    mapping (address => CertificateDepositInfo) private certificateDeposit;

    // 事件們，用於通知前端 web3.js
    event DepositEvent(address indexed from, uint256 value, uint256 timestamp);
    event WithdrawEvent(address indexed from, uint256 value, uint256 timestamp);
    event TransferEvent(address indexed from, address indexed to, uint256 value, uint256 timestamp);
    event CertificateDepositEvent(address indexed from, uint256 value,uint256 period,uint256 timestamp);
    event AdvancedTerminationEvent(address indexed from, uint256 withdrowValue,uint256 periodWhileWithdrow,uint256 timestamp);
    event CD_ExpiresEvent(address indexed from, uint256 withdrowValue,uint256 periodWhileWithdrow,uint256 timestamp);

    modifier isOwner() {
        require(owner == msg.sender, "you are not owner");
        _;
    }

    // 建構子
    constructor() public payable {
        owner = msg.sender;
    }

    // 存錢
    function deposit() public payable {
        balance[msg.sender] += msg.value;

        emit DepositEvent(msg.sender, msg.value, now);
    }

    // 提錢
    function withdraw(uint256 etherValue) public {
        uint256 weiValue = etherValue * 1 ether;

        require(balance[msg.sender] >= weiValue, "your balances are not enough");

        msg.sender.transfer(weiValue);

        balance[msg.sender] -= weiValue;

        emit WithdrawEvent(msg.sender, etherValue, now);
    }

    // 轉帳
    function transfer(address to, uint256 etherValue) public {
        uint256 weiValue = etherValue * 1 ether;

        require(balance[msg.sender] >= weiValue, "your balances are not enough");

        balance[msg.sender] -= weiValue;
        balance[to] += weiValue;

        emit TransferEvent(msg.sender, to, etherValue, now);
    }

    // 檢查銀行帳戶餘額
    function getBankBalance() public view returns (uint256) {
        return balance[msg.sender];
    }

    // 購買定存
    //先判斷若使用者已購買過定存，則無法再購買
    function buyCertificateDeposit(uint _period) public payable{
        //  uint256 weiValue = etherValue * 1 ether;
        CertificateDepositInfo storage c = certificateDeposit[msg.sender];
        require(c.value==0 && c.period==0);
        c.period = _period;
        c.value=msg.value;
        emit CertificateDepositEvent(msg.sender, msg.value,_period, now);

    }


    //提前解約
    function CD_AdvancedTermination(uint _period) public{
        CertificateDepositInfo storage c = certificateDeposit[msg.sender];
        require(_period<=c.period);
        uint256 weiValue_period = c.value+c.value*_period/100;
        msg.sender.transfer(weiValue_period);
        emit AdvancedTerminationEvent(msg.sender,weiValue_period,_period,now);
        c.period = 0;
        c.value=0;
    }

    //合約到期，把錢轉給使用者
    function CD_Expires() public{
        CertificateDepositInfo storage c = certificateDeposit[msg.sender];
        require(c.value!=0 && c.period!=0);
        uint256 weiValue_period = (c.value+c.value*c.period/100);
        msg.sender.transfer(weiValue_period);
        emit CD_ExpiresEvent(msg.sender,weiValue_period,c.period,now);
        c.period = 0;
        c.value=0;
    }

    function kill() public isOwner {
        selfdestruct(owner);
    }
}