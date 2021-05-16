import React from 'react'
import styled from 'styled-components'
import SettingsTab from '../Settings'

import { RowBetween, RowFixed } from '../Row'
import { TYPE } from '../../theme'
import { ArrowWrapper, BottomGrouping, Dots, SwapCallbackError, Wrapper } from '../../components/swap/styleds'
import { ButtonGray, ButtonLight, ButtonPrimary, ButtonBlue } from '../../components/Button'

const StyledSwapHeader = styled.div`
  padding: 1rem 1.25rem 0.5rem 1.25rem;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <TYPE.black fontWeight={500} fontSize={16} style={{ marginRight: '8px' }}></TYPE.black>
        </RowFixed>
        <RowFixed>
          {/* <TradeInfo disabled={!trade} trade={trade} /> */}
          {/* <div style={{ width: '8px' }}></div> */}
          <SettingsTab />
        </RowFixed>
      </RowBetween>
    </StyledSwapHeader>
  )
}
