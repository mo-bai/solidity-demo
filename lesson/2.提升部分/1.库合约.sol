// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 省GAS 好用的函数的集合 lodash 大神的函数库
 * 1.不能存状态变量
 * 2.不能继承或者被继承
 * 3.不能payable 不能接收eth
 * 4.不可以被销毁
 */

library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";

    // 将uint256 转换为string
    function toString(uint256 value) public pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function toHexString(uint256 value) public pure returns (string memory) {
        if (value == 0) return "0x0";
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }
    // 函数重载
    function toHexString(
        uint256 value,
        uint256 length
    ) public pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }
}

contract Test {
    // 使用库合约
    using Strings for uint256;

    function test() public pure returns (string memory) {
        return uint256(1234567890).toString();
    }

    function test2(uint256 value) public pure returns (string memory) {
        value.toHexString();
        return Strings.toHexString(value);
    }
}
