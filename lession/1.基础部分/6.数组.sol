// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract array_demo {
    string[5] public names;
    uint256[] public ages;

    constructor() {
        names[0] = "zhangsan";
        // 定长数组不允许用 push 方法
        // names.push("李四");

        // 动态数组不允许不存在的下标
        // ages[0] = 18;
        ages.push(18);
    }
    function setName(string memory name, uint256 index) public {
        names[index] = name;
    }

    function getName(uint256 index) public view returns (string memory) {
        return names[index];
    }

    function getLength() public view returns (uint256, uint256) {
        return (names.length, ages.length);
    }
}
