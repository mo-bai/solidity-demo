/**
 *  1.状态变量： 存储在区块链上的变量， 可以被所有函数访问
 *  1.1 存储状态变量
 *  1.2 内存状态变量
 *  1.3 常量状态变量
 *  1.4 视图状态变量
 *  1.5 公共状态变量
 *  1.6 私有状态变量
 *  1.7 内部状态变量
 *  1.8 外部状态变量
 */

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract StateVariables {
    // 下面都是状态变量
    string public message;
    uint8 private age;
    string public constant author = "John";

    constructor() {
        message = "Hello, World!";
        age = 20;
    }

    // 视图状态变量
    function getMessage() public view returns (string memory) {
        return message;
    }

    // 公共状态变量
    function getAge() public view returns (uint8) {
        return age;
    }

    // 私有状态变量
    function getAuthor() private pure returns (string memory) {
        return author;
    }
}
