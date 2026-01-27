import styled, { keyframes } from 'styled-components'
import { useMapStore } from '@/stores'
import { KoreaMap } from './KoreaMap'
import { RegionMap } from './RegionMap'
import { MapNavigation } from './MapNavigation'
import { MapLegend } from './MapLegend'
import { ZoomControls } from './ZoomControls'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
`

const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  animation: ${fadeIn} 0.3s ease-out;
`

const ControlsWrapper = styled.div`
  position: absolute;
  right: 16px;
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
`

const LegendWrapper = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 10;
`

interface MainMapProps {
  sidoRecordCounts?: Record<string, number>
  sigunguRecordCounts?: Record<string, number>
  onSidoClick?: (name: string, code: string) => void
  onSigunguClick?: (name: string, code: string) => void
}

export function MainMap({
  sidoRecordCounts = {},
  sigunguRecordCounts = {},
  onSidoClick,
  onSigunguClick,
}: MainMapProps) {
  const { currentLevel, selectedSido } = useMapStore()

  const isCountryLevel = currentLevel === 'country'

  return (
    <Container>
      <MapNavigation />

      <MapWrapper key={isCountryLevel ? 'country' : selectedSido}>
        {isCountryLevel ? (
          <KoreaMap recordCounts={sidoRecordCounts} onSidoClick={onSidoClick} />
        ) : (
          selectedSido && (
            <RegionMap
              sidoName={selectedSido}
              recordCounts={sigunguRecordCounts}
              onSigunguClick={onSigunguClick}
            />
          )
        )}

        <ControlsWrapper>
          <ZoomControls />
        </ControlsWrapper>

        <LegendWrapper>
          <MapLegend />
        </LegendWrapper>
      </MapWrapper>
    </Container>
  )
}
