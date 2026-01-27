import { useCallback } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import styled from 'styled-components'
import { useMapStore, useRecordStore } from '@/stores'
import { RecordForm } from './RecordForm'
import { RecordList } from './RecordList'

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  animation: overlayShow 150ms ease;

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const ContentWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const Content = styled(Dialog.Content)`
  pointer-events: auto;
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  border-radius: 8px;
  box-shadow: 0 10px 38px rgba(0, 0, 0, 0.35);
  width: 90vw;
  max-width: 500px;
  max-height: 85vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing?.lg ?? '24px'};
  animation: contentShow 150ms ease;

  &:focus {
    outline: none;
  }

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @media (max-width: 480px) {
    width: 95vw;
    padding: ${({ theme }) => theme.spacing?.md ?? '16px'};
    max-height: 80vh;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing?.md ?? '16px'};
`

const Title = styled(Dialog.Title)`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
`

const CloseButton = styled(Dialog.Close)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    outline-offset: 2px;
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.xs ?? '4px'};
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'} ${({ theme }) => theme.spacing?.md ?? '16px'};
  background-color: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    outline-offset: 2px;
  }
`

function getModalTitle(
  modalType: 'region' | 'record' | 'form' | null,
  selectedSigungu: string | null,
  isEditing: boolean
): string {
  switch (modalType) {
    case 'region':
      return selectedSigungu ?? '지역 정보'
    case 'form':
      return isEditing ? '기록 수정' : '새 기록 추가'
    case 'record':
      return '기록 상세'
    default:
      return ''
  }
}

export function RecordModal() {
  const {
    isModalOpen,
    modalType,
    modalRecordId,
    selectedSido,
    selectedSigungu,
    closeModal,
    openModal,
  } = useMapStore()

  const { selectedRecord, setSelectedRecord } = useRecordStore()

  const isEditing = modalType === 'form' && modalRecordId !== null

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeModal()
        setSelectedRecord(null)
      }
    },
    [closeModal, setSelectedRecord]
  )

  const handleAddClick = useCallback(() => {
    openModal('form')
  }, [openModal])

  const handleFormSuccess = useCallback(() => {
    if (selectedSigungu) {
      openModal('region')
    } else {
      closeModal()
    }
  }, [selectedSigungu, openModal, closeModal])

  const handleEditRecord = useCallback(
    (recordId: string) => {
      openModal('form', recordId)
    },
    [openModal]
  )

  const renderContent = () => {
    switch (modalType) {
      case 'region':
        return (
          <>
            <RecordList
              sido={selectedSido ?? ''}
              sigungu={selectedSigungu ?? ''}
              onEditRecord={handleEditRecord}
            />
            <AddButton onClick={handleAddClick}>+ 기록 추가</AddButton>
          </>
        )
      case 'form':
        return (
          <RecordForm
            sido={selectedSido ?? ''}
            sigungu={selectedSigungu ?? ''}
            recordId={modalRecordId ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => (selectedSigungu ? openModal('region') : closeModal())}
          />
        )
      case 'record':
        return selectedRecord ? (
          <RecordList
            sido={selectedRecord.sido}
            sigungu={selectedRecord.sigungu}
            onEditRecord={handleEditRecord}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <ContentWrapper>
          <Content>
            <Header>
              <Title>{getModalTitle(modalType, selectedSigungu, isEditing)}</Title>
              <CloseButton aria-label="닫기">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </CloseButton>
            </Header>
            {renderContent()}
          </Content>
        </ContentWrapper>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
