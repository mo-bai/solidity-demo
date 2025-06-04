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
    // 当前红包轮次，每次提现+1
    uint256 public currentRound;
    // mapping不能清空，所以用uint256记录红包轮次，记录红包领取者的地址
    mapping(uint256 => mapping(address => bool)) public isGrabbed;

    constructor(uint256 _count, bool _isEqual) payable {
        require(msg.value > 0, "amount must be greater than 0");
        owner = payable(msg.sender);
        count = _count;
        isEqual = _isEqual;
        totalAmount = msg.value;
        currentRound = 1;
    }

    // 红包充值
    function deposit(uint256 _count, bool _isEqual) public payable {
        require(msg.value > 0, "amount must be greater than 0");
        require(
            (count + _count) > 0,
            "left count + new count must be greater than 0"
        );
        // 更新余额
        totalAmount += msg.value;
        // 保留原来的红包个数
        count += _count;
        // 更新红包发放方式
        isEqual = _isEqual;
    }

    // 红包提现
    function withdraw() public {
        require(msg.sender == owner, "only owner can withdraw");
        payable(owner).transfer(totalAmount);
        // 重置红包个数
        count = 0;
        // 重置余额
        totalAmount = 0;
        // 进入新的红包轮次
        currentRound++;
    }

    // 获取合约账户余额
    function geBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function grabRedPacket() public returns (uint256) {
        // 判断是否已经发完了
        require(count > 0, "NoMoreRedPackets");

        // 判断钱是不是已发完了
        require(totalAmount > 0, "InsufficientBalance");

        // 判断当前用户是否已经领取过了
        require(!isGrabbed[currentRound][msg.sender], "AlreadyGrabbed");

        // 记录当前用户
        isGrabbed[currentRound][msg.sender] = true;

        uint256 amount;
        // 剩一个红包就全部发给这个人
        if (count == 1) {
            amount = totalAmount;
            totalAmount = 0;
            payable(msg.sender).transfer(amount);
        } else {
            if (isEqual) {
                // 等额红包
                amount = totalAmount / count;
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
                amount = (totalAmount * random) / 10;
                totalAmount -= amount;
                payable(msg.sender).transfer(amount);
            }
        }
        count--;

        return amount;
    }
}
