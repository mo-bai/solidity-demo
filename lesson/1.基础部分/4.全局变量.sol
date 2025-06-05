// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract GlobalVariables {
    address public message;
    bytes public data;

    // https://docs.soliditylang.org/en/v0.8.30/units-and-global-variables.html#block-and-transaction-properties
    constructor() {
        //  block 就是全局变量，表示当前区块
        message = block.coinbase; // 获取当前区块的矿工地址
        // - block.difficulty (uint):当前块的难度系数
        // - block.gaslimit (uint):当前块gas的上限
        // - block.number (uint):当前块编号
        // - block.blockhash (function(uint) returns (bytes32)):函数，返回指定块的哈希值，已经被内建函数blockhash所代替
        // - block.timestamp (uint):当前块的时间戳

        // msg 就是全局变量，表示当前消息
        data = msg.data; // 获取当前消息的数据
        // - msg.gas (uint):剩余的gas量
        // - msg.sender (address):消息的发送方(调用者)
        // - msg.sig (bytes4):calldata的前四个字节(即函数标识符)
        // - msg.value (uint):所发送的消息中的Wei （以太坊激励体系内最小的虚拟数字货币单位）数量
    }
}
