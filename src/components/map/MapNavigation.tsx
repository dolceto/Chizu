import { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useMapStore } from '@/stores'
import type { Country } from '@/types'
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

const CountrySelect = styled.select`
  padding: 6px 28px 6px 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text ?? '#374151'};
  background-color: ${({ theme }) => theme.colors?.surface ?? '#F3F4F6'};
  border: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  border-radius: 6px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    box-shadow: 0 0 0 2px ${({ theme }) => (theme.colors?.primary ? theme.colors.primary + '20' : 'rgba(59, 130, 246, 0.2)')};
  }
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
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors?.text ?? '#374151' : theme.colors?.secondary ?? '#6B7280'};
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 400)};
`

const Separator = styled.span`
  color: ${({ theme }) => theme.colors?.secondary ?? '#9CA3AF'};
`

interface MapNavigationProps {
  showBackButton?: boolean
}

const COUNTRY_NAMES = {
  korea: '대한민국',
  japan: '일본',
} as const

export function MapNavigation({ showBackButton = true }: MapNavigationProps) {
  const { selectedCountry, currentLevel, selectedSido, drillUp, setCountry } = useMapStore()

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

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCountry(e.target.value as Country)
    },
    [setCountry]
  )

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

      <CountrySelect value={selectedCountry} onChange={handleCountryChange}>
        <option value="korea">{COUNTRY_NAMES.korea}</option>
        <option value="japan">{COUNTRY_NAMES.japan}</option>
      </CountrySelect>

      {displaySido && (
        <Breadcrumb>
          <Separator>/</Separator>
          <BreadcrumbItem $isActive={!isCountryLevel}>{displaySido}</BreadcrumbItem>
        </Breadcrumb>
      )}
    </NavContainer>
  )
}
