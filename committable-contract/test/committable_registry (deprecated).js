// NOTE: This file is deprecated!
// For referring to JS contract interaction, please move to ethers/main.js.

const CommittableRegistry = artifacts.require("CommittableRegistry");
const Committable = artifacts.require("Committable");

contract("CommittableRegistry", accounts => {
        it("should initialize with empty repository list", async () => {
            const registry = await CommittableRegistry.deployed();
            assert.equal(await registry.numberOfRepos.call(), 0, "repository list not empty");
        });

        it("should deploy committable with correct", async () => {
            const repoURI = "https://github.com/repo1";
            const repoName = "repo1";
            const repoSymbol = "REP1";

            const registry = await CommittableRegistry.deployed();
            assert.isFalse(await registry.activates.call(repoURI), "repo should initialize as inactivated");

            // Activate committable
            registry.activateCommittable(repoURI, repoName, repoSymbol);
            assert.isTrue(await registry.activates.call(repoURI), "repo should be marked as activated");

            assert.isNotNull(await registry.committables.call(repoURI), "committable should not be null");
            assert.equal(await registry.numberOfRepos.call(), 1, "repository list should contain 1 element");
            assert.equal(await registry.repos.call(0), repoURI, "repo URI must equal which deploy function returns");
        });

        it("should mint committable with correct", async () => {
            const repoURI = "https://github.com/repo1";
            const commitId = BigInt(0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925);
            const tokenURI = "https://ipfs.io/0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925";

            const registry = await CommittableRegistry.deployed();

            // Mint committable
            const tx = await registry.mintCommittable(repoURI, commitId, tokenURI, accounts[0]);
            const tokenId = await tx.logs[0].args.tokenId;

            // Retrieve committable
            const address = await registry.committables.call(repoURI);
            const committable = await Committable.at(address);
            assert.isNotNull(committable, "committable should not be null");

            const tokenOwner = accounts[0];
            assert.equal(await committable.balanceOf.call(tokenOwner), 1, "token owner should now have 1 committable");
            assert.equal(await committable.ownerOf.call(tokenId), tokenOwner, "token owner mismatch for minted committable");
            assert.equal(await committable.tokenURI.call(tokenId), tokenURI, "tokenURI mismatch for minted committable");
        });

        it("should grant dividend with correct", async () => {
            const repoURI = "https://github.com/repo1";

            const registry = await CommittableRegistry.deployed();
            const address = await registry.committables.call(repoURI);
            const committable = await Committable.at(address);
            assert.equal(await committable.totalShares.call(), 1, "total shares should be 1");
            assert.equal(await committable.totalReleased.call(), 0, "total released should be 0");
            assert.equal(await committable.totalGranted.call(), 0, "total granted should be 0");

            assert.equal(await committable.payees.call(0), accounts[0], "token owner should be the only payee");
            assert.equal(await committable.releaseQuota.call(accounts[0]), 0, "release quota should equal 0 for committer");


            // assert.throws(await committable.releaseDividend(accounts[0]), "Committable: account has no shares");
            console.log(committable);
        });
    }
)
