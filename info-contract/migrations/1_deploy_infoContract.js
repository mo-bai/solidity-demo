const infoContract = artifacts.require('infoContract')
module.exports = function (deployer) {
  deployer.deploy(infoContract)
}
