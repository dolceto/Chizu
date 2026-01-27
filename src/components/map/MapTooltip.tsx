import styled from 'styled-components'
import type { TooltipPosition } from '@/types'

interface MapTooltipProps {
  region: string | null
  position: TooltipPosition | null
}

const TooltipContainer = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  pointer-events: none;
  white-space: nowrap;
  z-index: 50;
  transform: translate(8px, 8px);
`

export function MapTooltip({ region, position }: MapTooltipProps) {
  if (!region || !position) {
    return null
  }

  return (
    <TooltipContainer $x={position.x} $y={position.y}>
      {region}
    </TooltipContainer>
  )
}
