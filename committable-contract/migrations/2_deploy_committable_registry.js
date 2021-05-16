const CommittableRegistry = artifacts.require("CommittableRegistry");

module.exports = function (deployer) {
    deployer.deploy(CommittableRegistry);
};
