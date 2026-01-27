import { useCallback } from 'react'
import styled from 'styled-components'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

const Overlay = styled(AlertDialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 300;
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

const Content = styled(AlertDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 301;
  width: 90vw;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  border-radius: 12px;
  box-shadow: 0 10px 38px rgba(0, 0, 0, 0.35);
  padding: ${({ theme }) => theme.spacing?.lg ?? '24px'};
  animation: contentShow 150ms ease;

  &:focus {
    outline: none;
  }

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`

const Title = styled(AlertDialog.Title)`
  margin: 0 0 8px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
`

const Description = styled(AlertDialog.Description)`
  margin: 0 0 20px 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing?.sm ?? '8px'};
`

const Button = styled.button<{ $variant?: 'danger' | 'default' | 'cancel' }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, theme }) => {
    if ($variant === 'danger') {
      return `
        background-color: #EF4444;
        border: none;
        color: white;

        &:hover {
          background-color: #DC2626;
        }
      `
    }
    if ($variant === 'cancel') {
      return `
        background-color: transparent;
        border: 1px solid ${theme.colors?.border ?? '#E5E7EB'};
        color: ${theme.colors?.text ?? '#111827'};

        &:hover {
          background-color: ${theme.colors?.surface ?? '#F9FAFB'};
        }
      `
    }
    return `
      background-color: ${theme.colors?.primary ?? '#3B82F6'};
      border: none;
      color: white;

      &:hover {
        opacity: 0.9;
      }
    `
  }}

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    outline-offset: 2px;
  }
`

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel()
      }
    },
    [onCancel]
  )

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialog.Portal>
        <Overlay />
        <Content>
          <Title>{title}</Title>
          <Description>{message}</Description>
          <ButtonGroup>
            <AlertDialog.Cancel asChild>
              <Button $variant="cancel">{cancelText}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button $variant={variant} onClick={onConfirm}>
                {confirmText}
              </Button>
            </AlertDialog.Action>
          </ButtonGroup>
        </Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
