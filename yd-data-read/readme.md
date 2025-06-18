测试链 sepolia
合约地址： 0xBE614F3C6172E9859004BB6c2cCb1dDAd32E28Df

# 遇到的问题

1. 在远程环境中，交易完成后不能拿到对应的信息

- 需要等待块完全确认，才能拿到块所有信息

2. 使用 wagmi useWatchContractEvent 监听事件无效

- 后面直接使用 publicClient 监听事件

3. 使用 the graph 使用 sepolia 网络提示只能用 substream

- the graph 的网络列表中有很多 sepolia，看到第一个所以一直卡住，实际上是 Ethereum sepolia TESTNET

4. 使用 graph-cli 创建 subgraph 时，需要 development ID，导致过不去

- 使用 graph-cli 不是创建 subgraph ，而是 contract

5. subgraph 部署完成后，发布需要 eth

- 不发布也可以查询

6. the graph api-key 在 subgraph 界面中找不到

- 在主 dashboard 里

7. 使用 the graph 查询数据时，需要等待一段时间才能查到数据

- 之前是交易确认后就查询，发现查不到对应的块，所以加了按钮手动获取数据
