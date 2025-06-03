// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract RedPacket {
    // 定义红包发放的主体
    address payable public owner;
    // 定义红包的金额
    uint256 public totalAmount;
    // 红包的个数
    uint256 public count;
    // 是否等额红包
    bool public isEqual;
    // 记录红包领取者的地址
    mapping(address => bool) isGrabbed;

    constructor(uint256 _count, bool _isEqual) payable {
        require(msg.value > 0, "amount must be greater than 0");
        owner = payable(msg.sender);
        count = _count;
        isEqual = _isEqual;
        totalAmount = msg.value;
    }

    // 获取合约账户余额
    function geBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function grabRedPacket() public {
        // 判断是否已经发完了
        require(count > 0, "no more red packets");
        // 判断钱是不是已发完了
        require(totalAmount > 0, "total amount must be greater than 0");
        // 判断当前用户是否已经领取过了
        require(
            !isGrabbed[msg.sender],
            "you have already grabbed the red packet"
        );
        // 记录当前用户
        isGrabbed[msg.sender] = true;
        // 剩一个红包就全部发给这个人
        if (count == 1) {
            payable(msg.sender).transfer(totalAmount);
        } else {
            if (isEqual) {
                // 等额红包
                uint256 amount = totalAmount / count;
                totalAmount -= amount;
                payable(msg.sender).transfer(amount);
            } else {
                // 随即红包
                // 随机一个 1-8 的数字
                uint256 random = (// 将 hash 值转换为 uint256
                uint256(
                    // 输出 256 位哈希值
                    keccak256(
                        // 不定长的编码
                        abi.encodePacked(
                            msg.sender,
                            owner,
                            count,
                            totalAmount,
                            block.timestamp
                        )
                    )
                ) % 8) + 1;
                uint256 amount = (totalAmount * random) / 10;
                payable(msg.sender).transfer(amount);
                totalAmount -= amount;
            }
        }
        count--;
    }
}
