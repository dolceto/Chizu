import styled, { keyframes } from 'styled-components'
import { useToastStore, ToastType } from '@/stores/toastStore'

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`

const Container = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
`

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
  info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8' },
  success: { bg: '#F0FDF4', border: '#22C55E', text: '#15803D' },
  error: { bg: '#FEF2F2', border: '#EF4444', text: '#DC2626' },
  warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#D97706' },
}

const ToastItem = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  min-width: 280px;
  max-width: 400px;
  background-color: ${({ $type }) => TOAST_COLORS[$type].bg};
  border: 1px solid ${({ $type }) => TOAST_COLORS[$type].border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${slideIn} 200ms ease;
  pointer-events: auto;

  &.removing {
    animation: ${slideOut} 200ms ease forwards;
  }
`

const IconWrapper = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ $type }) => TOAST_COLORS[$type].text};
`

const Message = styled.span<{ $type: ToastType }>`
  flex: 1;
  font-size: 0.875rem;
  color: ${({ $type }) => TOAST_COLORS[$type].text};
  line-height: 1.4;
`

const CloseButton = styled.button<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ $type }) => TOAST_COLORS[$type].text};
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'error':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )
    case 'warning':
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      )
  }
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <Container>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} $type={toast.type}>
          <IconWrapper $type={toast.type}>
            <ToastIcon type={toast.type} />
          </IconWrapper>
          <Message $type={toast.type}>{toast.message}</Message>
          <CloseButton $type={toast.type} onClick={() => removeToast(toast.id)}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </CloseButton>
        </ToastItem>
      ))}
    </Container>
  )
}
