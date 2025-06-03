/**
  // - public	最大的访问权限，子类可以继承、可以访问，当前类能访问
  // - private  只有该合约可以调用 仅限内部访问，子类不能继承、不能访问


  // - internal  内部函数 内部正常访问，外部无法访问。子类可以继承、可以访问，当前类可以访问
  // - external  外部函数。内部不能访问。子类可以继承、可以访问，当前类不能访问

  // - view 对状态变量只读，这里的状态变量还包含区块链的内建对象数据、时间戳等
  // - pure 既不修改，也不读取状态变量的值
  // - const 合约不修改状态变量的值，但是可以读取状态变量的值
  // - payable 设计以太币的转移 （资金控制类的）
  // - 自定义修饰符 支持自定义修饰符号 自定义控制类
  // 顺序  public < external < internal < private。
 */

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract FunctionAndModifier {
    function getSum() public pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < 100; i++) {
            sum += i;
        }
        return sum;
    }

    function getSum2() public pure returns (uint256) {
        uint256 sum = 0;
        uint256 i = 0;
        while (i < 100) {
            sum += i;
            i++;
        }
        return sum;
    }
}
