import Link from 'next/link'
import styled from 'styled-components'
import { ChizuLogo } from '@/components/common'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.background};
  text-align: center;
`

const LogoWrapper = styled.div`
  margin-bottom: 32px;
`

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 1;

  ${({ theme }) => theme.media.mobile} {
    font-size: 5rem;
  }
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 16px 0 8px;
  color: ${({ theme }) => theme.colors.text};

  ${({ theme }) => theme.media.mobile} {
    font-size: 1.25rem;
  }
`

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 32px;
  max-width: 400px;
`

const MapIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
`

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: #111827;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(251, 185, 23, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default function NotFound() {
  return (
    <Container>
      <LogoWrapper>
        <ChizuLogo size={48} />
      </LogoWrapper>

      <MapIcon>🗺️</MapIcon>

      <ErrorCode>404</ErrorCode>

      <Title>페이지를 찾을 수 없습니다</Title>

      <Description>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        지도에서 새로운 장소를 탐험해보세요!
      </Description>

      <HomeButton href="/">
        <BackIcon />
        지도로 돌아가기
      </HomeButton>
    </Container>
  )
}
