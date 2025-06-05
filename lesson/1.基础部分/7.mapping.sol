// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract map_demo {
    mapping(address => string) addr_names;

    constructor() {
        addr_names[msg.sender] = "zhangsan";
    }

    function setName(string memory name) public {
        addr_names[msg.sender] = name;
    }

    function getName() public view returns (string memory) {
        return addr_names[msg.sender];
    }
}
