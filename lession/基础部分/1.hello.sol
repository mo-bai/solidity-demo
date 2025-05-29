// 这句话必须要，作用是定义许可证
// SPDX-License-Identifier: GPL-3.0

// 这句话必须要，作用是定义版本
pragma solidity >=0.7.0 <0.9.0;

// 导入hardhat的console.sol
import "hardhat/console.sol";

// 定义一个合约
contract HelloWorld {
    string public message;

    constructor() {
        console.log("Hello, World!");
        message = "Hello, World!";
    }
}
