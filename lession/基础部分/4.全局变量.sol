// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract GlobalVariables {
    address public message;
    bytes public data;

    constructor() {
        //  block 就是全局变量，表示当前区块
        message = block.coinbase; // 获取当前区块的矿工地址

        // msg 就是全局变量，表示当前消息
        data = msg.data; // 获取当前消息的数据
    }
}
