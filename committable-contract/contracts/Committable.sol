// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";

contract Committable is Ownable, ERC721Enumerable, ERC721URIStorage, IERC777Recipient {
    /**
    * @dev In `Committable`, we support directed donations to repositories.

    * The donation is distributed as dividends with command of repo owner,
    * where each developer owns part of the donation equals to his/her share
    * of contribution. For simplicity, we denote each Committable (aka NFT)
    * as equally one share of contribution. In future, more complex mechanism
    * may be introduced to award developers committing real value to the repo.
    *
    * The donation dividend capability of `Committable` is ported directly from
    * open-zeppelin's `PaymentSplitter` contract, plus a dynamic share update
    * functionality that is unique for our use case.
    */

    /**
    * @dev
    */
    event PayeeAdded(address indexed account, uint256 shares);
    event PaymentReceived(address indexed from, uint256 amount);

    /**
    * @dev
    */
    event DividendGranted(address indexed by, uint256 amount);
    event DividendReleased(address indexed to, uint256 amount);

    /**
    * @dev
    */
    event ERC777TokenReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes userData,
        bytes operatorData
    );

    /**
    * @dev Total number of shares held/released to all `Committable` owners
    */
    uint256 public totalShares;
    uint256 public totalReleased;

    // Total amount of ETH granted by repository owner
    uint256 public totalGranted;

    /**
    * @dev
    */
    mapping(address => uint256) public shares;
    mapping(address => uint256) public released;
    address[] public payees;

    /**
    * @dev This is the constructor of `Committable`, which represents a collection of NFTs (aka Committables)
    * minted for a specific git repository (e.g., one hosted on Github).
    *
    * Since `Committable` derives from both `ERC721` and `PaymentSplitter`, we need to invoke corresponding
    * constructors first, i.e., `ERC721(name_, symbol_)` and `PaymentSplitter([address(0x0)], [0])`.
    */
    constructor (string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    /**
    * @dev
    */
    function mint(
        address committableOwner,
        string memory commitId,
        string memory committableURI
    ) public onlyOwner virtual returns (uint256) {
        bytes32 hash = keccak256(abi.encodePacked(commitId));
        uint256 tokenId = bytes32ToUint256(hash);
        super._safeMint(committableOwner, tokenId);
        super._setTokenURI(tokenId, committableURI);

        // For simplicity, we view each `Committable` equally as one share
        _addPayee(committableOwner, 1);
        return tokenId;
    }

    /**
    * @dev
    */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable, ERC721) {
        ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
    }

    /**
    * @dev
    */
    function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721) {
        ERC721URIStorage._burn(tokenId);
    }

    /**
    * @dev
    */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721Enumerable, ERC721) returns (bool) {
        return ERC721Enumerable.supportsInterface(interfaceId);
    }

    /**
    * @dev
    */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721URIStorage, ERC721) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     */
    receive() external payable virtual {
        emit PaymentReceived(_msgSender(), msg.value);
    }

    /**
    * @dev
    */
    function grantDividend(uint256 amount) public onlyOwner virtual {
        require(amount > 0, "Committable: can not commit grant with empty amount");
        require(totalGranted + amount <= address(this).balance, "Committable: amount exceeds remaining ETH holding");
        totalGranted += amount;
        emit DividendGranted(_msgSender(), amount);
    }

    /**
     * @dev
     */
    function releaseQuota(address account) public virtual returns (uint256) {
        uint256 payment = totalGranted * shares[account] / totalShares - released[account];
        return payment;
    }

    /**
     * @dev Triggers a transfer to `account` of the amount of Ether they are owed,
     * according to their percentage of the total shares and their previous withdrawals.
     */
    function releaseDividend(address payable account) public virtual {
        require(shares[account] > 0, "Committable: account has no shares");

        uint256 payment = totalGranted * shares[account] / totalShares - released[account];

        require(payment != 0, "Committable: account is not due payment");

        released[account] = released[account] + payment;
        totalReleased = totalReleased + payment;

        Address.sendValue(account, payment);
        emit DividendReleased(account, payment);
    }

    /**
     * @dev Add a new payee to the contract.
     * @param account The address of the payee to add.
     * @param shares_ The number of shares owned by the payee.
     */
    function _addPayee(address account, uint256 shares_) private {
        require(account != address(0), "Committable: account is the zero address");
        require(shares_ > 0, "Committable: shares are 0");
        require(shares[account] == 0, "Committable: account already has shares");

        payees.push(account);
        shares[account] = shares_;
        totalShares = totalShares + shares_;
        emit PayeeAdded(account, shares_);
    }

    /**
    * @dev
    */
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override {
        emit ERC777TokenReceived(operator, from, to, amount, userData, operatorData);
        revert("Committable: do not support donation other than native ETH");
    }

    /**
    * @dev Convert bytes32 variable `x` to uint256 `y` of equal value.
    *
    * For example, bytes32(0x01) is converted as uint256(0x01).
    */
    function bytes32ToUint256(bytes32 x) public pure returns (uint256) {
        uint256 y;
        for (uint256 i = 0; i < 32; i++) {
            uint8 c = uint8(x[i]);
            y = y * 2 ** 8 + uint256(c);
        }
        return y;
    }
}
