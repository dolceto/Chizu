import { useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { MainMap } from '@/components/map'
import { RecordModal } from '@/components/ui'
import type { Record as VisitRecord } from '@/types'
import { useMapStore, useRecordStore } from '@/stores'
import { getAllRecords } from '@/db/records'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
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
  flex: 1;
  padding: 24px;
`

const RecentSection = styled.section`
  max-width: 900px;
  margin: 24px auto 0;
  padding: 0 16px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`

const RecentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`

const RecentCard = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
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
        <Logo>Chizu</Logo>
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
    </Container>
  )
}
