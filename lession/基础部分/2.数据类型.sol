// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// import "hardhat/console.sol";

/**
 *  1.string : utf-8编码的字符串类型 "a" == "a"
 *  2.bool : 布尔类型
 *  3.uint : 无符号整型, uint256(0~2的256次方-1)
 *  4.int : 有符号整型, int256(-2的255次方~2的255次方-1)
 *  5.byte : 字节类型， 1个字节8位
 *  6.bytes : 字节类型数组，比如 bytes4(0x12345678) 表示4个字节
 *  5.address : 地址类型，可以包装数字为地址来使用 
      address(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
      
 *  6.payable : 函数修饰符，表示当前函数可以花钱
 *  7.const：常量， 编译时计算， 不能修改
 *  8.... as ... 表示类型转换
      0x5B38Da6a701c568545dCfcB03FcB875f56beddC4  as address
      0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 as payable
 */
