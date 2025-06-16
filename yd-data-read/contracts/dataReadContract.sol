// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract DataReadContract {
    // 配合 the graph 来记录日志
    event DataSet(address indexed user, string data);

    // 设置数据
    function setData(string memory _data) public {
        emit DataSet(msg.sender, _data);
    }

    // 用来接收未定义的函数调用，不让交易失败即可，有 msg.data 的函数调用会走这里
    fallback() external payable {}

    // 没有 msg.data 的函数调用
    receive() external payable {}
}
