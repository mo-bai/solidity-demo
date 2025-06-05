// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract payable_demo {
    uint256 public balance;
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }
    function getBalance() public view returns (uint256) {
        // 合约账户本身是存在这个对应的余额的
        // 获取当前合约的余额
        return address(this).balance;
    }
    // 存款
    function deposit() public payable {
        //msg.value 代表了用户转账的金额
        balance += msg.value;
    }
    // 取款
    function withdraw(uint256 _num, address _to) public {
        require(msg.sender == owner, "not owner");
        require(_num <= balance, "not enough balance");
        // 给指定地址转账
        payable(_to).transfer(_num);
        balance -= _num;
    }
}
