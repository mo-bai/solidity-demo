// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract struct_demo {
    struct Person {
        string name;
        uint age;
    }

    // 定义一个映射，将地址映射到Person结构体
    mapping(address => Person) addr_person;

    constructor() {
        // msg.sender 是当前调用合约的用户地址
        // 部署合约时 constructor 执行，此时 msg.sender 是合约的部署者
        addr_person[msg.sender] = Person("zhangsan", 18);
    }

    function setPerson(string memory name, uint age) public {
        addr_person[msg.sender] = Person(name, age);
    }

    function getPerson() public view returns (Person memory) {
        return addr_person[msg.sender];
    }
}
