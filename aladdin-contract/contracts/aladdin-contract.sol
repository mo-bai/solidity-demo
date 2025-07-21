// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AladdinContract is Ownable {
    // 合约中的金额
    uint256 public totalAmount;
    // 记录质押人的钱
    mapping(address => uint256) public record;

    // AD代币合约
    IERC20 public usdtToken; // USDT 合约

    constructor(address _usdtAddress) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtAddress);
    }

    // 用户质押金额到合约中
    function deposit(uint256 _amount) public {
        require(
            usdtToken.balanceOf(msg.sender) >= _amount,
            "Insufficient USDT balance"
        );
        require(
            usdtToken.allowance(msg.sender, address(this)) >= _amount,
            "Please approve USDT first"
        );
        // 转移 USDT 到合约
        usdtToken.transferFrom(msg.sender, address(this), _amount);
        record[msg.sender] += _amount;
        totalAmount += _amount;
    }

    // 用户取回质押的钱
    function withdraw(uint256 _amount) public {
        require(record[msg.sender] >= _amount, "insufficient balance");
        usdtToken.transfer(msg.sender, _amount);
        record[msg.sender] -= _amount;
        totalAmount -= _amount;
    }

    // 获取当前用户质押的金额
    function getUserDeposit(address _user) public view returns (uint256) {
        return record[_user];
    }

    // 获取当前合约的质押金额
    function getTotalDeposit() public view returns (uint256) {
        return totalAmount;
    }
    // 合约所有者取回质押的所有钱
    function withdrawAll() public onlyOwner {
        usdtToken.transfer(owner(), totalAmount);
        totalAmount = 0;
    }
    // 用户付款给另一个地址
    function sendToAddress(address _to, uint256 _amount) public {
        require(record[msg.sender] >= _amount, "insufficient balance");
        usdtToken.transfer(_to, _amount);
        record[msg.sender] -= _amount;
        totalAmount -= _amount;
    }
}
