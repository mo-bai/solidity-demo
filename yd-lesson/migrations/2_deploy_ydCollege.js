const YDLessonToken = artifacts.require('YDLessonToken')
const YDCollege = artifacts.require('YDCollege')

module.exports = async function (deployer) {
  // 获取已部署的代币合约实例
  const tokenInstance = await YDLessonToken.deployed()

  // 部署课程合约，传入代币合约地址
  await deployer.deploy(YDCollege, tokenInstance.address)
  const collegeInstance = await YDCollege.deployed()

  console.log('YDCollege deployed at:', collegeInstance.address)
  console.log('Using token at:', tokenInstance.address)

  // 为了测试方便，可以添加一些初始课程
  if (process.env.NODE_ENV === 'development') {
    console.log('Adding test lessons...')
    await collegeInstance.addLesson(
      '你好啊！区块链',
      '了解区块链基础知识',
      100, // 100 YD
      'https://product.dangdang.com/11753467613.html',
      'https://img3m3.ddimg.cn/8/31/11753467613-1_b_1716384083.jpg'
    )
    await collegeInstance.addLesson(
      'Solidity智能合约教程',
      '学习智能合约开发',
      200, // 200 YD
      'https://product.dangdang.com/29610461.html',
      'https://img3m1.ddimg.cn/56/27/29610461-1_b_1692167968.jpg'
    )
    console.log('Test lessons added')
  }
}
