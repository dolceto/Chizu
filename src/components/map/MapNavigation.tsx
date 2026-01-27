import styled from 'styled-components'
import { useMapStore } from '@/stores'

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

export function MapNavigation({ showBackButton = true }: MapNavigationProps) {
  const { currentLevel, selectedSido, drillUp } = useMapStore()

  const isCountryLevel = currentLevel === 'country'

  return (
    <NavContainer>
      {!isCountryLevel && showBackButton && (
        <BackButton onClick={drillUp}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          뒤로
        </BackButton>
      )}

      <Breadcrumb>
        <BreadcrumbItem $isActive={isCountryLevel}>대한민국</BreadcrumbItem>
        {selectedSido && (
          <>
            <Separator>/</Separator>
            <BreadcrumbItem $isActive={!isCountryLevel}>{selectedSido}</BreadcrumbItem>
          </>
        )}
      </Breadcrumb>
    </NavContainer>
  )
}
