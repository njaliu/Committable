import { useCallback } from 'react'
import { ContractFactory, Contract } from '@ethersproject/contracts'
import CommittableRegistry from '../../abis/CommittableRegistry.json'
import { Interface } from '@ethersproject/abi'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse, Web3Provider } from '@ethersproject/providers'

export function CreateCommittableContract(account: string | null | undefined, library: Web3Provider | undefined) {
  if (!library || !account) {
    return
  }

  const contractFactory = ContractFactory.fromSolidity(CommittableRegistry, library.getSigner())
  return contractFactory.deploy()
}

export function CallCommittableActivateCommittable1(
  account: string | null | undefined,
  library: Web3Provider | undefined,
  contractAddress: string,
  repoURI: string,
  repoName: string,
  repoSymbol: string
) {
  if (!library || !account) {
    return
  }

  const iface = new Interface(CommittableRegistry.abi)
  console.log('activateCommittable', [repoURI, repoName, repoSymbol])
  const data = iface.encodeFunctionData('activateCommittable', [repoURI, repoName, repoSymbol])

  const txn = {
    from: account,
    to: contractAddress,
    data: data,
  }
  library
    .getSigner()
    .estimateGas(txn)
    .then((estimate) => {
      const newTxn = {
        ...txn,
        gasLimit: calculateGasMargin(estimate),
      }

      return library
        .getSigner()
        .sendTransaction(newTxn)
        .then((response: TransactionResponse) => {
          console.log('success call with txn for deployCommittable1', response)
        })
        .catch((error) => {
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
            console.log('error call with txn')
          }
        })
    })
}

export function CallCommittableMintCommittable(
  account: string | null | undefined,
  library: Web3Provider | undefined,
  contractAddress: string,
  repoURI: string,
  commitId: number,
  tokenURI: string
) {
  if (!library || !account) {
    return
  }

  const iface = new Interface(CommittableRegistry.abi)
  console.log('mintCommittable', [repoURI, commitId, tokenURI, account])
  const data = iface.encodeFunctionData('mintCommittable', [repoURI, commitId, tokenURI, account])

  const txn = {
    from: account,
    to: contractAddress,
    data: data,
  }
  library
    .getSigner()
    .estimateGas(txn)
    .then((estimate) => {
      const newTxn = {
        ...txn,
        gasLimit: calculateGasMargin(estimate),
      }

      return library
        .getSigner()
        .sendTransaction(newTxn)
        .then((response: TransactionResponse) => {
          console.log('success call with txn for MintCommittable for commitId: ', commitId)
        })
    })
    .catch((error) => {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error)
        console.log('error call with txn')
      }
    })
}

// * grantDividend(
//   string memory repoURI,
//   uint256 amount
// )

export function CallCommittableGrantDividend(
  account: string | null | undefined,
  library: Web3Provider | undefined,
  contractAddress: string,
  repoURI: string,
  amount: number
) {
  if (!library || !account) {
    return
  }
  const iface = new Interface(CommittableRegistry.abi)
  console.log('grantDividend', [repoURI, amount])
  const data = iface.encodeFunctionData('grantDividend', [repoURI, amount])

  const retrievedContract = getContract(contractAddress, CommittableRegistry.abi, library, account)

  retrievedContract.functions['committables'](repoURI)
    .then((response) => {
      console.log('success call committables, ', response)
    })
    .catch((error) => {
      console.log('fail call committables, ')
    })
  const txn = {
    from: account,
    to: contractAddress,
    data: data,
  }
  library
    .getSigner()
    .estimateGas(txn)
    .then((estimate) => {
      const newTxn = {
        ...txn,
        gasLimit: calculateGasMargin(estimate),
      }

      return library
        .getSigner()
        .sendTransaction(newTxn)
        .then((response: TransactionResponse) => {
          console.log('success call with txn for grantDividend for repo: ', repoURI)
        })
    })
    .catch((error) => {
      // we only care if the error is something _other_ than the user rejected the tx
      if (error?.code !== 4001) {
        console.error(error)
        console.log('error call with txn: grantDividend')
      }
    })
}

export function CallCommittableActivateCommittable2(
  account: string | null | undefined,
  library: Web3Provider | undefined,
  contract: Contract,
  repoURI: string,
  repoName: string,
  repoSymbol: string
) {
  return useCallback((addr: string) => {
    if (!library || !account) {
      return
    }
    //  https://docs.ethers.io/v5/api/contract/contract/#Contract--creating
    // All overrides are optional
    let overrides = {
      // The maximum units of gas for the transaction to us
      gasLimit: 230000,
      from: account,
    }
    const retrievedContract = getContract(contract.address, CommittableRegistry.abi, library, account)
    retrievedContract.functions['activateCommittable']('repo2', 'repo3', 'REPO22').then((response) => {
      console.log('success call deployCommittable2, ', response)
    })
  }, [])
}

export function CallCommittableNumberOfRepos(
  account: string | null | undefined,
  library: Web3Provider | undefined,
  contract: Contract,
  repoURI: string,
  repoName: string,
  repoSymbol: string
) {
  return useCallback((addr: string) => {
    if (!library || !account) {
      return
    }
    contract.functions['numberOfRepos']().then((response) => {
      console.log('success call numberOfRepos, ', response)
    })
  }, [])
}
