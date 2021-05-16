### Build

```bash
truffle compile
```

### Contract Interface

#### CommittableRegistry.sol

* activateCommittable(
  string memory repoURI, string memory repoName, string memory repoSymbol
  )
  > 激活指定仓库的 Committable 合约。

  > 函数参数：
  > * repoURI: Git 仓库网址
  > * repoName: Git 仓库名
  > * repoSymbol: Git 仓库标志（可以为空）
* mintCommittable(
  string memory repoURI, string memory commitId, string memory tokenURI, address committer
  )
  > 铸造指定仓库的 Committable NFT。

  > 函数参数：
  > * repoURI: Git 仓库网址
  > * commitId: 铸造的 commit 编号（一般取 commit hash）
  > * tokenURI: 铸造 commit 的详细信息（一般为 IPFS 链接地址）
  > * committer: 铸造的 Committable 的拥有者地址
* grantDividend(
  string memory repoURI, uint256 amount
  )
  
> 对指定仓库执行分红操作。
  
  > 函数参数：
  > * repoURI: Git 仓库网址
  > * amount: 批准的分红金额（单位 wei = $10^{-18} eth$）

### JS Interaction Script

#### ethers.js （最新）

使用 ethers.js 函数库与智能合约交互的脚本 `ethers/main.js`。

#### web3.js （废弃）

使用 web3.js 函数库与智能合约交互的脚本 `web3/main.js`。
