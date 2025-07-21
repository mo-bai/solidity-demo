## 合约的功能

1. 用户发布 job，质押对应的金额
2. agent 接收任务后并完成
3. 用户将质押的金额转给 agent 用户
4. 用户取回当前 job 质押的剩余的金额
5. 用户取消 job，退回当前 job 质押的金额

## 合约部署流程

1. 配置 truffle-config.js 文件
2. 创建 .env 文件，配置参数
3. 编译合约：`truffle compile`
4. 在 magrations 文件夹下编辑部署脚本
5. 部署合约到测试网络：`truffle migrate --network sepolia`，保存控制台的合约部署地址
6. 验证合约

- 访问：https://sepolia.etherscan.io/
- 搜索合约地址
- 点击点击 "Contract" 标签
- 点击 "Verify and Publish" 按钮
- 在表单中填写对应的信息，注意 truffle-config.js 中编译器的配置
