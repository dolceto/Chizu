import { useEffect, useMemo, useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { RecordModal, SideMenu, ToastContainer } from '@/components/ui'
import { ChizuLogo } from '@/components/common'

const MainMap = dynamic(() => import('@/components/map/MainMap').then((mod) => mod.MainMap), {
  ssr: false,
  loading: () => <MapLoading>지도 로딩 중...</MapLoading>,
})
import type { Record as VisitRecord } from '@/types'
import { useMapStore, useRecordStore } from '@/stores'
import { getAllRecords } from '@/db/records'

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

const RecentSection = styled.section`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  max-width: 600px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
`

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`

const RecentGrid = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }
`

const RecentCard = styled.div`
  flex-shrink: 0;
  width: 160px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

const RecentDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

const RecentTitle = styled.h3`
  margin: 8px 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

const RecentLocation = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
`

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}

interface RecentRecordCardProps {
  record: VisitRecord
  onClick: () => void
}

function RecentRecordCard({ record, onClick }: RecentRecordCardProps) {
  return (
    <RecentCard onClick={onClick}>
      <RecentDate>{formatDate(record.visitedAt)}</RecentDate>
      <RecentTitle>{record.title}</RecentTitle>
      <RecentLocation>{record.sido} {record.sigungu}</RecentLocation>
    </RecentCard>
  )
}

export default function Home() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const { isModalOpen, openModal } = useMapStore()
  const { records, setRecords } = useRecordStore()

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

  const sidoRecordCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    records.forEach((record) => {
      counts[record.sido] = (counts[record.sido] ?? 0) + 1
    })
    return counts
  }, [records])

  const sigunguRecordCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    records.forEach((record) => {
      counts[record.sigungu] = (counts[record.sigungu] ?? 0) + 1
    })
    return counts
  }, [records])

  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
      .slice(0, 5)
  }, [records])

  const handleAddRecord = useCallback(() => {
    openModal('form')
  }, [openModal])

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
          <Button onClick={() => openModal('region')}>전체기록</Button>
          <Button $primary onClick={handleAddRecord}>
            + 새 기록
          </Button>
        </HeaderActions>
      </Header>

      <Main>
        <MainMap
          sidoRecordCounts={sidoRecordCounts}
          sigunguRecordCounts={sigunguRecordCounts}
        />

        {recentRecords.length > 0 && (
          <RecentSection>
            <SectionTitle>최근 기록</SectionTitle>
            <RecentGrid>
              {recentRecords.map((record) => (
                <RecentRecordCard
                  key={record.id}
                  record={record}
                  onClick={() => {
                    useRecordStore.getState().setSelectedRecord(record)
                    openModal('record')
                  }}
                />
              ))}
            </RecentGrid>
          </RecentSection>
        )}
      </Main>

      {isModalOpen && <RecordModal />}
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      <ToastContainer />
    </Container>
  )
}
