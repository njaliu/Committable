// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "./Committable.sol";

contract CommittableRegistry is Ownable, AccessControlEnumerable {
    /**
    * @dev
    */
    event DeployCommittable(
        string indexed repoURI,
        string indexed repoName,
        string indexed repoSymbol,
        Committable newCommittable
    );

    /**
    * @dev
    */
    event MintCommittable(
        address indexed minter,
        string indexed repoURI,
        string indexed tokenURI,
        uint256 tokenId
    );

    // Mappings from repo URI to activate status and deployed committable contract
    mapping(string => bool) public activates;
    mapping(string => Committable) public committables;

    // Array of all deployed repo URIs, used for enumeration
    string[] public repos;

    /**
    * @dev Role suffix strings for repository owners and contributors.
    *
    * We adopt the following convention when dealing with `CommittableRegistry` function access control:
    * 1) repository owner is granted role `<repoURI>_OWNER`, owners are permitted for `activateCommittable`,
    * and `grantDividend`;
    * 2) repository contributor is granted role `<repoURI>_CONTRIBUTOR`, contributors are currently not used;
    * 3) repository committer is granted role `<repoURI>_<commitId>_COMMITTER`, committers are permitted for
    * `mintCommittable` with corresponding commit id.
    */
    string private _separator = "_";
    string private _owner_role_suffix = "OWNER";
    string private _contributor_role_suffix = "CONTRIBUTOR";
    string private _committer_role_suffix = "COMMITTER";

    /**
    * @dev
    */
    constructor() {
        /*
        * @dev Grant `CommittableRegistry` owner as "DEFAULT_ADMIN_ROLE" role, which controls
        * whether other addresses can be regarded as "<REPO>_OWNER" (i.e., repository owner)
        * or "<REPO>_CONTRIBUTOR" (i.e., repository contributor, or developer).
        *
        * In other words, `CommittableRegistry` owner can later grant addresses as repository
        * owners or contributors, once they pass account integrity check (e.g., verify address
        * is actually held by corresponding users).
        */
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
    * @dev Retrieve number of git repositories that are already activated by their owners.
    */
    function numberOfRepos() public view returns (uint256) {
        return repos.length;
    }

    /**
    * @dev
    */
    modifier onlyRepoOwner(string memory repoURI) {
        // Only repository owner can activate `Committable`
        require(
            owner() == _msgSender() ||
            hasRole(keccak256(
                    abi.encodePacked(
                        repoURI,
                        _separator,
                        _owner_role_suffix
                    )),
                _msgSender()),
            "CommittableRegistry: caller should be 1) registry owner, or 2) repository owner");
        _;
    }

    /**
    * @dev Deploy a new committable contract, which represents a new activated git repository.
    *
    * This function is invoked when repository owner chooses to activate `Committable` for his/her repository.
    */
    function activateCommittable(
        string memory repoURI,
        string memory repoName,
        string memory repoSymbol
    ) public onlyRepoOwner(repoURI) virtual returns (Committable) {
        require(!activates[repoURI], "CommittableRegistry: repository has already been activated as Committable!");

        Committable committable = new Committable(repoName, repoSymbol);
        activates[repoURI] = true;
        committables[repoURI] = committable;
        repos.push(repoURI);

        emit DeployCommittable(repoURI, repoName, repoSymbol, committable);
        return committable;
    }

    /**
    * @dev
    */
    modifier onlyRepoCommitter(string memory repoURI, string memory commitId, address committer) {
        // Only repository contributor can mint `Committable`
        require(
            owner() == _msgSender() ||
            hasRole(keccak256(
                    abi.encodePacked(
                        repoURI,
                        _separator,
                        commitId,
                        _separator,
                        _committer_role_suffix
                    )),
                committer),
            "CommittableRegistry: 1) caller should be registry owner, or 2) committer should be commit owner");
        _;
    }

    /**
    * @dev
    */
    function mintCommittable(
        string memory repoURI,
        string memory commitId,
        string memory tokenURI,
        address committer
    ) public onlyRepoCommitter(repoURI, commitId, committer) virtual returns (uint256) {
        require(activates[repoURI], "CommittableRegistry: repository has not been activated as Committable!");

        Committable committable = committables[repoURI];
        uint256 tokenId = committable.mint(committer, commitId, tokenURI);
        emit MintCommittable(committer, repoURI, tokenURI, tokenId);
        return tokenId;
    }

    /**
    * @dev
    */
    function grantDividend(string memory repoURI, uint256 amount) public onlyRepoOwner(repoURI) virtual {
        require(activates[repoURI], "CommittableRegistry: repository has not been activated as Committable!");

        Committable committable = committables[repoURI];
        committable.grantDividend(amount);
    }
}
