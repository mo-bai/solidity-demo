// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface animalEat {
    function eat() external returns (uint256);
}

contract catEat is animalEat {
    function eat() public pure override returns (uint256) {
        return 100;
    }
}
