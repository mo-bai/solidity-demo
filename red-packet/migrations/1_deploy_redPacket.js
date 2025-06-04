const RedPacket = artifacts.require('RedPacket')

module.exports = function (deployer, network, accounts) {
  // 部署参数
  const count = 10 // 红包个数
  const isEqual = true // 是否等额红包
  const value = web3.utils.toWei('1', 'ether') // 发送1个以太币

  deployer.deploy(RedPacket, count, isEqual, {
    value: value,
    from: accounts[0]
  })
}
