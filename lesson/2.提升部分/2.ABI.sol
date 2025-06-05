// ABI 是 Application Binary Interface 的缩写，是智能合约的接口描述
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * 1.ABI编码 abi.encode, abi.encodePacked, abi.encodeWithSignature, abi.encodeWithSelector
 * 2.ABI解码 abi.decode
 */
// 数据是必须编码成字节码才能和智能合约交互！！！！
/**
 * 1.使用场景 abi.call 你不知道对方的interface
 * 2.生成abi.json 供前端调用
 * 3.对不开源的合约进行反编译比 0x7777f 调用ABI函数选择器来调用他
 */

contract ABIEncode {
    uint256 x = 10;
    address addr = 0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71;
    string name = "0xAA";
    uint256[2] array = [5, 6];

    function encode() public view returns (bytes memory result) {
        return abi.encode(x, addr, name, array);
    }

    function encodePacked() public view returns (bytes memory result) {
        return abi.encodePacked(x, addr, name, array);
    }

    function encodeWithSignature() public view returns (bytes memory result) {
        return abi.encodeWithSignature("encode()", x, addr, name, array);
    }

    function encodeWithSelector() public view returns (bytes memory result) {
        return
            abi.encodeWithSelector(
                this.encodeWithSelector.selector,
                x,
                addr,
                name,
                array
            );
    }

    function decode(
        bytes memory data
    ) public pure returns (uint256, address, string memory, uint256[2] memory) {
        return abi.decode(data, (uint256, address, string, uint256[2]));
    }
}
