const YDLessonToken = artifacts.require('YDLessonToken')

module.exports = async function (deployer) {
  // 部署代币合约
  await deployer.deploy(YDLessonToken)
  const tokenInstance = await YDLessonToken.deployed()

  console.log('YDLessonToken deployed at:', tokenInstance.address)
}
