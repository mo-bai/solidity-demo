// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract random_demo {
    function getRandom() public view returns (uint256) {
        bytes32 hashA = keccak256(
            abi.encode(block.timestamp, msg.sender, block.number, "zhangsan")
        );
        return uint256(hashA);
    }
    function isEqual(
        string memory a,
        string memory b
    ) public pure returns (bool) {
        // 将字符串转换为bytes,比如 "ZS" 转换后就是 0x5a53
        bytes memory aa = bytes(a);
        bytes memory bb = bytes(b);
        if (aa.length == 0 || bb.length == 0) return false;
        if (aa.length != bb.length) return false;
        for (uint256 i = 0; i < aa.length; i++) {
            if (aa[i] != bb[i]) return false;
        }
        return true;
    }
}
