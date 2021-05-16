import React from 'react'
import styled from 'styled-components'
import { TYPE } from 'theme'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '../../theme'
import { AutoColumn } from 'components/Column'
import Squiggle from '../../assets/images/squiggle.png'
import Texture from '../../assets/images/sandtexture.webp'
import { RowBetween } from 'components/Row'

const CTASection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: auto;
    grid-template-rows: auto;
  `};
`

const CTA1 = styled(ExternalLink)`
  background-size: 40px 40px;
  background-image: linear-gradient(to right, ${({ theme }) => theme.bg3} 1px, transparent 1px),
    linear-gradient(to bottom, ${({ theme }) => theme.bg3} 1px, transparent 1px);
  background-color: ${({ theme }) => theme.bg2};
  padding: 32px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.bg3};

  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }

  :hover {
    border: 1px solid ${({ theme }) => theme.bg5};
    background-color: ${({ theme }) => theme.bg2};
    text-decoration: none;
    * {
      text-decoration: none !important;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   padding: 1rem;
  `};
`

const CTA2 = styled(ExternalLink)`
  position: relative;
  overflow: hidden;
  padding: 32px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.bg4};

  * {
    color: ${({ theme }) => theme.text1};
    text-decoration: none !important;
  }

  :hover {
    border: 1px solid ${({ theme }) => theme.bg5};
    opacity: 0.7;
    text-decoration: none !important;
    * {
      text-decoration: none !important;
    }
  }

  :before {
    content: '';
    position: absolute;
    width: 340%;
    height: 280%;
    top: -130%;
    left: -134%;
    z-index: -1;
    background: url(${Texture}) 0 0 repeat;
    transform: rotate(-4deg);
  }
`

const HeaderText = styled(TYPE.label)`
  align-items: center;
  display: flex;
  margin-bottom: 24px;
  font-weight: 400;
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 20px;
  `};
`

const ResponsiveColumn = styled(AutoColumn)`
  gap: 12px;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    gap: 8px;
  `};
  justify-content: space-between;
`

const StyledImage = styled.img`
  margin-top: -28px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 80px;
    padding-right: 1rem;
  `};
`

export default function CTACards() {
  const { t } = useTranslation()

  return (
    <CTASection>
      <a href="https://ipfs.io/ipfs/Qmb3s7AHsShtU9Q92QWSbCZ3GYWHYQfpKWc68pw5MTqc7p">
        <img src="/images/45c57ca.svg" height="95%" width="95%" />
      </a>
      {/*<img src="/images/rare-NFTDescriptor.svg" height="95%" width="95%" />*/}
      {/*<img src="/images/rare-NFTDescriptor.svg" height="95%" width="95%" />*/}
      {/*<img src="/images/rare-NFTDescriptor.svg" height="95%" width="95%" />*/}
    </CTASection>
  )
}
