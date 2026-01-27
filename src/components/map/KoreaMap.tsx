import { useRef, useCallback, useEffect, memo } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import styled from 'styled-components'
import { useMapStore } from '@/stores'
import { getHeatmapColor } from '@/types'
import { MapTooltip } from './MapTooltip'

const SIDO_GEO_URL = '/data/geojson/korea/sido.json'

const KOREA_CENTER: [number, number] = [127.7669, 35.9078]
const KOREA_SCALE = 30000

interface KoreaMapProps {
  recordCounts?: Record<string, number>
  onSidoClick?: (name: string, code: string) => void
}

const HEADER_HEIGHT = '65px'

const MapContainer = styled.div`
  position: fixed;
  top: ${HEADER_HEIGHT};
  left: 0;
  width: 100vw;
  height: calc(100vh - ${HEADER_HEIGHT});
  touch-action: none;
  pointer-events: auto;

  svg {
    touch-action: none;
    width: 100vw !important;
    height: calc(100vh - ${HEADER_HEIGHT}) !important;
    max-width: none !important;
    max-height: none !important;
  }
`

export const KoreaMap = memo(function KoreaMap({ recordCounts = {}, onSidoClick }: KoreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const svg = mapRef.current?.querySelector('svg')
    if (svg) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
    }
  }, [])

  const {
    zoom,
    center,
    hoveredRegion,
    tooltipPosition,
    setZoom,
    setCenter,
    setHoveredRegion,
    drillDown,
  } = useMapStore()

  const handleMouseEnter = useCallback(
    (name: string) => {
      setHoveredRegion(name)
    },
    [setHoveredRegion]
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null)
  }, [setHoveredRegion])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent, name: string) => {
      const bounds = mapRef.current?.getBoundingClientRect()
      if (bounds) {
        setHoveredRegion(name, {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        })
      }
    },
    [setHoveredRegion]
  )

  const handleClick = useCallback(
    (name: string, code: string) => {
      drillDown(name)
      onSidoClick?.(name, code)
    },
    [drillDown, onSidoClick]
  )

  const handleMoveEnd = useCallback(
    (position: { coordinates: [number, number]; zoom: number }) => {
      setZoom(position.zoom)
      setCenter(position.coordinates)
    },
    [setZoom, setCenter]
  )

  return (
    <MapContainer ref={mapRef}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: KOREA_SCALE,
          center: KOREA_CENTER,
        }}
        width={5000}
        height={5000}
        style={{ width: '100%', height: '100%', minWidth: '100%', minHeight: '100%' }}
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          minZoom={0.5}
          maxZoom={4}
          onMoveEnd={handleMoveEnd}
          translateExtent={[
            [-Infinity, -Infinity],
            [Infinity, Infinity],
          ]}
        >
          <Geographies geography={SIDO_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name as string
                const code = geo.properties.code as string
                const count = recordCounts[name] ?? 0
                const isHovered = hoveredRegion === name

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleClick(name, code)}
                    onMouseEnter={() => handleMouseEnter(name)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(e) => handleMouseMove(e, name)}
                    style={{
                      default: {
                        fill: getHeatmapColor(count),
                        stroke: '#9CA3AF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: isHovered ? '#60A5FA' : getHeatmapColor(count),
                        stroke: '#6B7280',
                        strokeWidth: 1,
                        outline: 'none',
                        filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#3B82F6',
                        outline: 'none',
                        cursor: 'pointer',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <MapTooltip region={hoveredRegion} position={tooltipPosition} />
    </MapContainer>
  )
})

KoreaMap.displayName = 'KoreaMap'
