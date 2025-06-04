// 简单的记录信息的合约
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract InfoContract {
    string public name;
    uint256 public age;

    function sayHi() public pure returns (string memory) {
        return "Hello, World!";
    }

    event InfoSet(string name, uint256 age);

    function setInfo(string memory _name, uint256 _age) public {
        name = _name;
        age = _age;
        emit InfoSet(_name, _age);
    }

    function getInfo() public view returns (string memory, uint256) {
        return (name, age);
    }
}
