# 本周作业流程

1. 学习 solidity 语法，完成 infoContract.sol 合约的编写
2. 下载 ganache，创建本地区块链
   2.1 使用 ganache 创建本地区块链
   2.2 保存新创建的区块链
3. 使用 metaMask 连接本地区块链，并添加 本地区块链上提供的账户
4. 安装 truffle 全局依赖，将合约部署到 ganache 本地链上
   4.1 使用 truffle init 初始化项目
   4.2 配置 truffle-config.js 文件，配置本地链信息和编译器版本
   4.3 使用费 truffle build 编译合约，生出合约的 JSON 文件
   4.4 在 migrations 文件夹下编写部署脚本，指定要部署的合约文件
   4.5 使用 truffle deploy 部署合约
5. 使用 ethers v6 库+ jquery 构建页面，对代码进行注释理解
   5.1 创建合约实例时的 ABI 信息来自 build 文件夹下的 JSON 文件
   5.2 合约地址在部署时的控制台中显示或在 ganache 创建合约的块信息中显示

# 遇到的问题

1. truffle 部署失败，提示网络连接不上

- 重启 ganache 即可

2. 抢红包时获取抢到的金额无法直接返回

- solidity 的写入函数不能直接获取返回值，只返回交易 hash，需要通过 event 来传递返回值。但是事件会广播给所有正在监听的节点，会暴露抢到的金额。最终还是选择使用 前后余额的比较来展示抢到的金额

3. 测试时无法拿到准确的报错信息

- ganache 的错误处理机制相对简单，会返回通用错误，所以需要通过模拟调用，检查是否会出错，再进行实际调用
