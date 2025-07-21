const AladdinContract = artifacts.require('AladdinContract')

module.exports = async function (deployer) {
  // 部署课程合约，传入代币合约地址
  await deployer.deploy(
    AladdinContract,
    '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0'
  )
  const aladdinContract = await AladdinContract.deployed()

  console.log('AladdinContract deployed at:', aladdinContract.address)
  console.log('Using token at:', '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0')
}
