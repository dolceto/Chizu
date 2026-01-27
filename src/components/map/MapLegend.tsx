import styled from 'styled-components'
import { HEATMAP_COLORS } from '@/types'

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const ColorBox = styled.div<{ $color: string }>`
  width: 1rem;
  height: 1rem;
  background-color: ${({ $color }) => $color};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.125rem;
`

const LegendLabel = styled.span`
  white-space: nowrap;
`

const LEGEND_ITEMS = [
  { level: 0, label: '0', color: HEATMAP_COLORS[0] },
  { level: 1, label: '1-5', color: HEATMAP_COLORS[1] },
  { level: 2, label: '6-20', color: HEATMAP_COLORS[2] },
  { level: 3, label: '21-50', color: HEATMAP_COLORS[3] },
  { level: 4, label: '51-100', color: HEATMAP_COLORS[4] },
  { level: 5, label: '100+', color: HEATMAP_COLORS[5] },
] as const

export function MapLegend() {
  return (
    <LegendContainer>
      {LEGEND_ITEMS.map(({ level, label, color }) => (
        <LegendItem key={level}>
          <ColorBox $color={color} />
          <LegendLabel>{label}</LegendLabel>
        </LegendItem>
      ))}
    </LegendContainer>
  )
}
