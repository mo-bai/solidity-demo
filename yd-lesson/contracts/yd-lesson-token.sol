// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YDLessonToken is ERC20, Ownable {
    // 代币名称
    string public constant NAME = "YiDengERC20Token";

    // 代币缩写
    string public constant SYMBOL = "YD";

    // 代币初始发型量
    uint256 public constant INITIAL_SUPPLY = 1000000;

    // ETH 兑换比率 (1 ETH = 10000 YD)
    uint256 public constant EXCHANGE_RATE = 10000;

    constructor() ERC20(NAME, SYMBOL) Ownable() {
        // 使用 _mint 方法，将代币发行给合约的创建者
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // 重写 decimals 方法，返回 0，表示代币没有小数点,否则就和eth一样18位小数
    function decimals() public pure override returns (uint8) {
        return 0;
    }

    // 使用 ETH 购买代币，payable 会将 msg.value 自动转入合约
    function buyTokens() public payable {
        // 按照兑换比例，检查 eth 数量至少大于 0.0001
        require(
            msg.value > 0.0001 ether,
            "ETH amount must be greater than 0.0001"
        );
        uint256 tokenAmount = (msg.value * EXCHANGE_RATE) / 1 ether;
        require(
            balanceOf(owner()) >= tokenAmount,
            "Insufficient tokens in contract"
        );
        // 将代币从合约所有者转移到购买者
        _transfer(owner(), msg.sender, tokenAmount);
    }

    // 提取合约中的 ETH（只有合约拥有者可以调用）
    function withdrawETH() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
