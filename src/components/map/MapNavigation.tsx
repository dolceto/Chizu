import { useMemo } from 'react'
import styled from 'styled-components'
import { useMapStore } from '@/stores'
import { getPrefectureNameKo } from './prefectureNames'

const NavContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors?.background ?? '#ffffff'};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors?.text ?? '#374151'};
`

const BreadcrumbItem = styled.span<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors?.text ?? '#374151' : theme.colors?.secondary ?? '#6B7280'};
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
`

const Separator = styled.span`
  color: ${({ theme }) => theme.colors?.secondary ?? '#9CA3AF'};
`

const FlagEmoji = styled.span`
  font-size: 16px;
  line-height: 1;
`

interface MapNavigationProps {
  showBackButton?: boolean
}

const COUNTRY_INFO = {
  korea: { name: '대한민국', flag: '🇰🇷' },
  japan: { name: '일본', flag: '🇯🇵' },
} as const

export function MapNavigation({ showBackButton = true }: MapNavigationProps) {
  const { selectedCountry, currentLevel, selectedSido, drillUp } = useMapStore()

  const isCountryLevel = currentLevel === 'country'

  // 시구정촌 레벨일 때 뒤로 버튼 표시 (한국, 일본 모두)
  const showBack = showBackButton && !isCountryLevel

  // 일본 도도부현명을 한글로 변환
  const displaySido = useMemo(() => {
    if (!selectedSido) return null
    if (selectedCountry === 'japan') {
      return getPrefectureNameKo(selectedSido)
    }
    return selectedSido
  }, [selectedSido, selectedCountry])

  const countryInfo = COUNTRY_INFO[selectedCountry]

  return (
    <NavContainer>
      {showBack && (
        <BackButton onClick={drillUp}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          뒤로
        </BackButton>
      )}

      <Breadcrumb>
        <BreadcrumbItem $isActive={isCountryLevel}>
          <FlagEmoji>{countryInfo.flag}</FlagEmoji>
          {countryInfo.name}
        </BreadcrumbItem>
        {displaySido && (
          <>
            <Separator>/</Separator>
            <BreadcrumbItem $isActive={!isCountryLevel}>{displaySido}</BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
    </NavContainer>
  )
}
