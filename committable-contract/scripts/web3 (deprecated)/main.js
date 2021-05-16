// NOTE: This file is deprecated!
// For referring to JS contract interaction, please move to ethers/main.js.

const Web3 = require('web3');
const FileSystem = require('fs/promises');

let web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

async function main() {
    let accounts = await web3.eth.getAccounts();

    let artifactString = await FileSystem.readFile('../build/contracts/CommittableRegistry.json', {
        encoding: 'utf-8'
    });
    let CommittableRegistryArtifact = await JSON.parse(artifactString);
    let CommittableRegistry = await new web3.eth.Contract(CommittableRegistryArtifact.abi);

    // console.log(CommittableRegistry);
    let registry = await CommittableRegistry.deploy({
        data: CommittableRegistryArtifact.bytecode
    }).send({
        from: accounts[0],
        gas: 6000000
    });
    let repos = await registry.methods.numberOfRepos().call();
    console.log(repos);
    let deployTx = await registry.methods.deployCommittable('repo1', 'repo1', 'REPO1').send({
        from: accounts[0],
        gas: 6000000
    });
    // console.log(deployTx);
    registry.getPastEvents('DeployCommittable', {}, function (error, events) {
        console.log(events);
    });
}

main().then(value => {
    console.log(value); // Success!
}, reason => {
    console.error(reason); // Error!
});

