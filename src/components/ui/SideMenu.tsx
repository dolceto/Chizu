import { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import * as Dialog from '@radix-ui/react-dialog'
import { useToastStore } from '@/stores'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.5);
  animation: overlayShow 200ms ease;

  @keyframes overlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const Content = styled(Dialog.Content)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 201;
  width: 280px;
  max-width: 80vw;
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
  animation: slideIn 200ms ease;
  display: flex;
  flex-direction: column;

  &:focus {
    outline: none;
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing?.md ?? '16px'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
`

const Title = styled(Dialog.Title)`
  margin: 0;
  font-size: 1.125rem;
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

const MenuList = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'};
  overflow-y: auto;
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.sm ?? '8px'};
  width: 100%;
  padding: ${({ theme }) => theme.spacing?.md ?? '16px'};
  border: none;
  border-radius: 8px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
  font-size: 0.9375rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors?.surface ?? '#F9FAFB'};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    outline-offset: -2px;
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  }
`

const Divider = styled.div`
  height: 1px;
  margin: ${({ theme }) => theme.spacing?.sm ?? '8px'} 0;
  background-color: ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
`

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing?.md ?? '16px'};
  border-top: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  text-align: center;
`

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const addToast = useToastStore((state) => state.addToast)

  const handleMenuClick = useCallback(() => {
    addToast('준비 중입니다', 'info')
    onClose()
  }, [addToast, onClose])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Header>
            <Title>메뉴</Title>
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

          <MenuList>
            <MenuItem onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              홈
            </MenuItem>

            <MenuItem onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              내 기록
            </MenuItem>

            <MenuItem onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              캘린더
            </MenuItem>

            <MenuItem onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              통계
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              설정
            </MenuItem>

            <MenuItem onClick={handleMenuClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              도움말
            </MenuItem>
          </MenuList>

          <Footer>Chizu v1.0.0</Footer>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
