const DataReadContract = artifacts.require('DataReadContract')

module.exports = function (deployer) {
  deployer.deploy(DataReadContract)
}
