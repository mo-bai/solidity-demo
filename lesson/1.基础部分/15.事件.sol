// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Events {
    mapping(address => uint256) public _balances;

    // event 在 solidity中是用来记录合约执行过程中的一些事件
    event Transfer(address indexed from, address indexed to, uint256 value);

    function _transfer(address from, address to, uint256 amount) external {
        _balances[from] = 100;
        _balances[from] -= amount;
        _balances[to] += amount;
        // 触发 event 事件，监听的函数可以接收到信息
        emit Transfer(from, to, amount);
    }
}
