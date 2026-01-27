import { useRef, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import styled from 'styled-components'
import { useMapStore } from '@/stores'
import { getHeatmapColor } from '@/types'
import { MapTooltip } from './MapTooltip'

const SEOUL_GEO_URL = '/data/geojson/korea/sigungu/seoul.json'

const SEOUL_CENTER: [number, number] = [127.0, 37.56]
const SEOUL_SCALE = 45000

interface SeoulMapProps {
  recordCounts?: Record<string, number>
  onDistrictClick?: (name: string, code: string) => void
}

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`

export function SeoulMap({ recordCounts = {}, onDistrictClick }: SeoulMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  const {
    zoom,
    hoveredRegion,
    tooltipPosition,
    setZoom,
    setHoveredRegion,
    setSelectedSigungu,
    openModal,
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
      setSelectedSigungu(name)
      openModal('region')
      onDistrictClick?.(name, code)
    },
    [setSelectedSigungu, openModal, onDistrictClick]
  )

  const handleZoomEnd = useCallback(
    (event: { zoom: number }) => {
      setZoom(event.zoom)
    },
    [setZoom]
  )

  return (
    <MapContainer ref={mapRef}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: SEOUL_SCALE,
          center: SEOUL_CENTER,
        }}
        width={400}
        height={400}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup
          zoom={zoom}
          minZoom={0.5}
          maxZoom={4}
          onMoveEnd={handleZoomEnd}
        >
          <Geographies geography={SEOUL_GEO_URL}>
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
}
