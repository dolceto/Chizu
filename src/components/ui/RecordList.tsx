import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useRecordStore, useToastStore } from '@/stores'
import { deleteRecord } from '@/db/records'
import { ConfirmModal } from './ConfirmModal'
import type { Category, Country, Record as VisitRecord } from '@/types'

const CATEGORY_LABELS: { [key in Category]: string } = {
  cafe: '카페',
  restaurant: '음식점',
  travel: '여행',
  culture: '문화',
  etc: '기타',
}

const CATEGORY_COLORS: { [key in Category]: string } = {
  cafe: '#8B4513',
  restaurant: '#DC2626',
  travel: '#2563EB',
  culture: '#7C3AED',
  etc: '#6B7280',
}

interface RecordListProps {
  sido: string
  sigungu: string
  country?: Country
  onEditRecord: (recordId: string) => void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm ?? '8px'};
  margin-bottom: ${({ theme }) => theme.spacing?.md ?? '16px'};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing?.xl ?? '32px'};
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing?.sm ?? '8px'};
`

const EmptyText = styled.p`
  margin: 0;
  font-size: 0.875rem;
`

const RecordCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? '4px'};
  padding: ${({ theme }) => theme.spacing?.md ?? '16px'};
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  border: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  border-radius: 8px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing?.sm ?? '8px'};
`

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
  flex: 1;
  word-break: break-word;
`

const CategoryBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background-color: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.md ?? '16px'};
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`

const CardMemo = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing?.xs ?? '4px'};
  margin-top: ${({ theme }) => theme.spacing?.xs ?? '4px'};
`

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  padding: 4px 12px;
  background-color: transparent;
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === 'danger' ? '#EF4444' : (theme.colors?.border ?? '#E5E7EB')};
  border-radius: 4px;
  font-size: 0.75rem;
  color: ${({ theme, $variant }) =>
    $variant === 'danger' ? '#EF4444' : (theme.colors?.secondary ?? '#6B7280')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $variant }) =>
      $variant === 'danger' ? '#FEE2E2' : 'transparent'};
    border-color: ${({ theme, $variant }) =>
      $variant === 'danger' ? '#EF4444' : (theme.colors?.text ?? '#111827')};
    color: ${({ theme, $variant }) =>
      $variant === 'danger' ? '#DC2626' : (theme.colors?.text ?? '#111827')};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    outline-offset: 2px;
  }
`

const RecordCount = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  margin-bottom: ${({ theme }) => theme.spacing?.sm ?? '8px'};
`

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function RecordList({ sido, sigungu, country, onEditRecord }: RecordListProps) {
  const { getRecordsBySigungu, getRecordsBySido, deleteRecord: deleteFromStore } = useRecordStore()
  const addToast = useToastStore((state) => state.addToast)
  const [deleteTarget, setDeleteTarget] = useState<VisitRecord | null>(null)

  // 일본은 시군구가 없으므로 도도부현으로 조회
  const records =
    country === 'japan' && !sigungu
      ? getRecordsBySido(sido, country)
      : getRecordsBySigungu(sido, sigungu, country)

  const handleDeleteClick = useCallback((record: VisitRecord) => {
    setDeleteTarget(record)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return

    try {
      await deleteRecord(deleteTarget.id)
      deleteFromStore(deleteTarget.id)
      addToast('기록이 삭제되었습니다', 'success')
    } catch (error) {
      console.error('Failed to delete record:', error)
      addToast('삭제에 실패했습니다. 다시 시도해주세요.', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }, [deleteTarget, deleteFromStore, addToast])

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  if (records.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>📍</EmptyIcon>
          <EmptyText>아직 기록이 없습니다</EmptyText>
          <EmptyText>첫 번째 방문 기록을 추가해보세요!</EmptyText>
        </EmptyState>
      </Container>
    )
  }

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
  )

  return (
    <Container>
      <RecordCount>총 {records.length}개의 기록</RecordCount>
      {sortedRecords.map((record) => (
        <RecordCard key={record.id}>
          <CardHeader>
            <CardTitle>{record.title}</CardTitle>
            {record.category && (
              <CategoryBadge $color={CATEGORY_COLORS[record.category]}>
                {CATEGORY_LABELS[record.category]}
              </CategoryBadge>
            )}
          </CardHeader>

          <CardMeta>
            <MetaItem>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(record.visitedAt)}
            </MetaItem>
            {record.address && (
              <MetaItem>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {record.address}
              </MetaItem>
            )}
          </CardMeta>

          {record.memo && <CardMemo>{record.memo}</CardMemo>}

          <CardActions>
            <ActionButton onClick={() => onEditRecord(record.id)}>수정</ActionButton>
            <ActionButton $variant="danger" onClick={() => handleDeleteClick(record)}>
              삭제
            </ActionButton>
          </CardActions>
        </RecordCard>
      ))}

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="기록 삭제"
        message={`"${deleteTarget?.title ?? ''}" 기록을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Container>
  )
}
