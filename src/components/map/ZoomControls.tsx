import styled from 'styled-components'
import { useMapStore } from '@/stores'

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 10;
`

const ZoomButton = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.25rem;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export function ZoomControls() {
  const { zoom, setZoom } = useMapStore()

  const handleZoomIn = () => {
    setZoom(zoom + 0.5)
  }

  const handleZoomOut = () => {
    setZoom(zoom - 0.5)
  }

  return (
    <ControlsContainer>
      <ZoomButton onClick={handleZoomIn} disabled={zoom >= 4} aria-label="Zoom in">
        +
      </ZoomButton>
      <ZoomButton onClick={handleZoomOut} disabled={zoom <= 0.5} aria-label="Zoom out">
        -
      </ZoomButton>
    </ControlsContainer>
  )
}
