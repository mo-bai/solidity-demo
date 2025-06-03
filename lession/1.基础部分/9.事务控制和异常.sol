// SPDX-License-Identifier: GPL-3.0

/**
 * 1. revert 事务回滚，会消耗gas
 * 2. error 消耗gas最低
 *   2.1 使用 error 可以告知用户异常原因，还能省gas
 * 3. assert 错误判断，会消耗所有的gas。 assert(bool,cond_expr)
 *   3.1 一般用于检测系统级别的错误 代码层面的错误，函数结尾或者函数头部 入参和必要条件检测
 * 4. require(bool cond_expr, string msg);会退还剩余的gas
 *   4.1 跟用户打交道的 require(input_var>100)
 *   4.2 合约调合约 require(合约地址 != address(0))
 */

pragma solidity >=0.7.0 <0.9.0;
import "hardhat/console.sol";

error TransferNotOwner(uint256 count);
struct User {
    string name;
    uint8 age;
    string sex;
}

contract strcut_demo {
    User user;

    constructor() {
        user.name = "zhangsan";
    }
    function setUser(string memory name, uint8 age, string memory sex) public {
        // solidity 中不能直接用 == 来比较两个字符串，所以要转换成 keccak256 数字来比较
        if (
            keccak256(abi.encodePacked(user.name)) !=
            keccak256(abi.encodePacked(name))
        ) {
            // 抛出异常
            revert TransferNotOwner(1);
        }
        user.age = age;
        user.sex = sex;
    }
}
