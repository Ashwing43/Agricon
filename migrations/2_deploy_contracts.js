const Farm = artifacts.require("Farm");

module.exports = function(deployer) {
  deployer.deploy(Farm);
};
