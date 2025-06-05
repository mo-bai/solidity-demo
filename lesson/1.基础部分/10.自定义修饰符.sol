// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract modifier_demo {
    address public admin;
    uint256 public amout;

    constructor() {
        admin = msg.sender;
        amout = 1000;
    }

    // 自定义修饰符
    modifier onlyAdmin() {
        // 检查msg.sender是否是admin
        require(msg.sender == admin, "not admin");
        // 执行完修饰符后，继续执行函数
        _;
    }

    // 使用修饰符限定函数执行条件
    function setAmout(uint256 _amout) public onlyAdmin {
        amout = _amout;
    }
}
