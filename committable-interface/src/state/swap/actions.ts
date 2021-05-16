import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export interface GithubInfo {
  githubID: string | null
  showRepo: boolean | null
  repos: {
    name: string
    owner: boolean
    selected: boolean
    activated: boolean
    contract?: string
    dividend?: string
  }[]
  showCommits: boolean | null
  commits: { commitID?: string; commitName?: string; commitDate?: string; repo: string }[]
  user: string
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('swap/selectCurrency')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
  githubInfo: GithubInfo | null
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
export const setGithubInfo = createAction<{ githubInfo: GithubInfo | null }>('swap/setGithubInfo')
