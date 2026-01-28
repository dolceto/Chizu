import { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { RecordModal, SideMenu, ToastContainer } from '@/components/ui'
import { ChizuLogo } from '@/components/common'

const MainMap = dynamic(() => import('@/components/map/MainMap').then((mod) => mod.MainMap), {
  ssr: false,
  loading: () => <MapLoading>지도 로딩 중...</MapLoading>,
})
import type { Record as VisitRecord } from '@/types'
import { VISIT_TYPE_SCORES, VISIT_TYPE_LABELS, VISIT_TYPE_COLORS } from '@/types'
import { useMapStore, useRecordStore } from '@/stores'
import { getAllRecords } from '@/db/records'
import { getPrefectureNameJa } from '@/components/map/prefectureNames'
import { getMunicipalityNameJa } from '@/components/map/japaneseToKorean'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background};
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.text};
  }
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $primary, theme }) =>
    $primary ? theme.colors.primary : theme.colors.background};
  color: ${({ $primary, theme }) =>
    $primary ? '#ffffff' : theme.colors.text};

  &:hover {
    opacity: 0.9;
  }
`

const DropdownContainer = styled.div`
  position: relative;
`

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &[data-open='true'] svg {
    transform: rotate(180deg);
  }
`

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  animation: slideDown 0.15s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const DropdownList = styled.div`
  padding: 8px;
`

const DropdownItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }
`

const DropdownItemLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const DropdownItemPlace = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const DropdownItemBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
`

const DropdownItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

const DropdownEmpty = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`

const Main = styled.main`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  min-height: 0;
  overflow: hidden;
`

const MapLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 900px;
  height: 500px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
`


function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}

function formatLocation(record: VisitRecord): string {
  if (record.country === 'japan') {
    // record.sido, record.sigungu는 이미 한글로 저장됨
    const sidoJa = getPrefectureNameJa(record.sido)
    const sigunguJa = record.sigungu ? getMunicipalityNameJa(record.sigungu) : ''

    if (record.sigungu) {
      return `${record.sido} ${record.sigungu} (${sidoJa} ${sigunguJa})`
    }
    return `${record.sido} (${sidoJa})`
  }

  return record.sigungu ? `${record.sido} ${record.sigungu}` : record.sido
}

const COUNTRY_FLAGS = {
  korea: '🇰🇷',
  japan: '🇯🇵',
} as const

export default function Home() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isRecordsDropdownOpen, setIsRecordsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isModalOpen, openModal, selectedCountry, setSelectedSido, setSelectedSigungu } = useMapStore()
  const { records, setRecords, setSelectedRecord } = useRecordStore()

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRecordsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAllRecords()
        setRecords(data)
      } catch (error) {
        console.error('Failed to load records:', error)
      }
    }
    fetchRecords()
  }, [setRecords])

  // 현재 국가의 레코드만 필터링
  const countryRecords = useMemo(() => {
    return records.filter((r) => r.country === selectedCountry)
  }, [records, selectedCountry])

  const sidoMaxScores = useMemo(() => {
    const scores: Record<string, number> = {}
    countryRecords.forEach((record) => {
      const score = VISIT_TYPE_SCORES[record.visitType] ?? 0
      scores[record.sido] = Math.max(scores[record.sido] ?? 0, score)
    })
    return scores
  }, [countryRecords])

  const sigunguMaxScores = useMemo(() => {
    const scores: Record<string, number> = {}
    countryRecords.forEach((record) => {
      const score = VISIT_TYPE_SCORES[record.visitType] ?? 0
      scores[record.sigungu] = Math.max(scores[record.sigungu] ?? 0, score)
    })
    return scores
  }, [countryRecords])

  // 전체 기록 (날짜순 정렬)
  const allRecords = useMemo(() => {
    return [...countryRecords].sort(
      (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
    )
  }, [countryRecords])

  const handleAddRecord = useCallback(() => {
    openModal('form')
  }, [openModal])

  const handleRecordClick = useCallback(
    (record: VisitRecord) => {
      setSelectedRecord(record)
      setSelectedSido(record.sido)
      setSelectedSigungu(record.sigungu)
      setIsRecordsDropdownOpen(false)
      openModal('record')
    },
    [setSelectedRecord, setSelectedSido, setSelectedSigungu, openModal]
  )

  return (
    <Container>
      <Header>
        <LeftSection>
          <HamburgerButton onClick={() => setIsSideMenuOpen(true)} aria-label="메뉴 열기">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </HamburgerButton>
          <LogoWrapper>
            <ChizuLogo size={28} />
          </LogoWrapper>
        </LeftSection>
        <HeaderActions>
          <DropdownContainer ref={dropdownRef}>
            <DropdownButton
              onClick={() => setIsRecordsDropdownOpen(!isRecordsDropdownOpen)}
              data-open={isRecordsDropdownOpen}
            >
              전체기록
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </DropdownButton>
            <DropdownContent $isOpen={isRecordsDropdownOpen}>
              <DropdownHeader>
                {COUNTRY_FLAGS[selectedCountry]} 전체 기록 ({allRecords.length}개)
              </DropdownHeader>
              <DropdownList>
                {allRecords.length === 0 ? (
                  <DropdownEmpty>아직 기록이 없습니다</DropdownEmpty>
                ) : (
                  allRecords.map((record) => (
                    <DropdownItem key={record.id} onClick={() => handleRecordClick(record)}>
                      <DropdownItemLocation>
                        <DropdownItemPlace>
                          {formatLocation(record)}
                        </DropdownItemPlace>
                        {record.visitType && (
                          <DropdownItemBadge $color={VISIT_TYPE_COLORS[record.visitType]}>
                            {VISIT_TYPE_LABELS[record.visitType]}
                          </DropdownItemBadge>
                        )}
                      </DropdownItemLocation>
                      <DropdownItemMeta>
                        <span>{record.title}</span>
                        <span>·</span>
                        <span>{formatDate(record.visitedAt)}</span>
                      </DropdownItemMeta>
                    </DropdownItem>
                  ))
                )}
              </DropdownList>
            </DropdownContent>
          </DropdownContainer>
          <Button $primary onClick={handleAddRecord}>
            + 새 기록
          </Button>
        </HeaderActions>
      </Header>

      <Main>
        <MainMap
          sidoMaxScores={sidoMaxScores}
          sigunguMaxScores={sigunguMaxScores}
        />

      </Main>

      {isModalOpen && <RecordModal />}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      <ToastContainer />
    </Container>
  )
}
