const ethers = require('ethers');
const FileSystem = require('fs/promises');

async function main() {
    // Blockchain provider URI
    const localProviderURI = 'http://127.0.0.1:7545';
    const remoteProviderURI = 'http://39.98.246.137:9999';

    // Prepare blockchain and account handler
    const provider = new ethers.providers.JsonRpcProvider(remoteProviderURI);
    const signer1 = provider.getSigner(0);

    // Deploy CommittableRegistry
    let registryArtifact = await FileSystem.readFile('../build/contracts/CommittableRegistry.json', {
        encoding: 'utf-8'
    });
    let CommittableRegistry = await JSON.parse(registryArtifact);
    const registryFactory = new ethers.ContractFactory(
        CommittableRegistry.abi,
        CommittableRegistry.bytecode,
        signer1
    );
    const registry = await registryFactory.deploy();

    /**
     * Start with single account operation.
     * */
        // Activate Committable
    const registrySinger1 = await registry.connect(signer1);
    const repo1URI = 'http://github.com/repo1';
    const repo1Name = 'repository 1';
    const repo1Symbol = 'REPO 1';

    await registrySinger1.activateCommittable(repo1URI, repo1Name, repo1Symbol);

    // Mint Committable
    const commit1Id = '0x984543f7a3ec157e59039c997a56a4f288f48848';
    const token1URI = 'ipfs://committable.io/0x984543f7a3ec157e59039c997a56a4f288f48848';
    const tx1 = await registrySinger1.mintCommittable(repo1URI, commit1Id, token1URI, await signer1.getAddress());
    const tx1Detail = await tx1.wait();
    const token1Id = tx1Detail.events[2].args[3];

    let committableArtifact = await FileSystem.readFile('../build/contracts/Committable.json', {
        encoding: 'utf-8'
    });
    let Committable = await JSON.parse(committableArtifact);
    const committable1Address = await registry.committables(repo1URI);
    const committable1 = await new ethers.Contract(committable1Address, Committable.abi, provider);
    const committableSinger1 = await committable1.connect(signer1);

    // Grant Dividend
    await signer1.sendTransaction({
        to: committable1.address,
        value: 20
    });
    await registrySinger1.grantDividend(repo1URI, 10);

    /**
     * Now look at multiple account operation.
     *
     * */
        // Grant repo owner role to another account
    const repo2URI = 'http://github.com/repo2';
    const repo2Name = 'repository 2';
    const repo2Symbol = 'REPO 2';

    const separator = '_';
    const ownerRoleSuffix = 'OWNER';
    const contributorRoleSuffix = 'CONTRIBUTOR';
    const committerRoleSuffix = 'COMMITTER';
    const signer2 = provider.getSigner(1);

    const repo2OwnerRole = await ethers.utils.solidityPack(
        ['string', 'string', 'string'],
        [repo2URI, separator, ownerRoleSuffix]
    );
    const repo2OwnerRoleHash = ethers.utils.keccak256(repo2OwnerRole);
    await registrySinger1.grantRole(
        repo2OwnerRoleHash,
        signer2.getAddress()
    );

    // Grant repo committer role to another account
    const commit2Id = '0xcbb1d714001cf4236b9a6122943cb5aab5079653';
    const token2URI = 'ipfs://committable.io/0xcbb1d714001cf4236b9a6122943cb5aab5079653';
    const repo2CommitterRole = await ethers.utils.solidityPack(
        ['string', 'string', 'string', 'string', 'string'],
        [repo2URI, separator, commit2Id, separator, committerRoleSuffix]
    );
    const repo2CommitterRoleHash = ethers.utils.keccak256(repo2CommitterRole);
    await registrySinger1.grantRole(
        repo2CommitterRoleHash,
        signer2.getAddress()
    );

    // Activate Committable from another account
    const registrySinger2 = await registry.connect(signer2);
    await registrySinger2.activateCommittable(repo2URI, repo2Name, repo2Symbol);

    // Mint Committable from another account
    const tx2 = await registrySinger2.mintCommittable(repo2URI, commit2Id, token2URI, await signer2.getAddress());
    const tx2Detail = await tx2.wait();
    const token2Id = tx1Detail.events[2].args[3];

    const committable2Address = await registry.committables(repo2URI);
    const committable2 = await new ethers.Contract(committable2Address, Committable.abi, provider);
    const committableSinger2 = await committable1.connect(signer2);

    // Grant dividend from another account
    await signer2.sendTransaction({
        to: committable2.address,
        value: 20
    });
    await registrySinger2.grantDividend(repo2URI, 10);
}

main().then(value => {
    console.log(value); // Success!
}, reason => {
    console.error(reason); // Error!
});
