import { useRef, useCallback, useMemo, useEffect, useState, memo } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import styled from 'styled-components'
import { useMapStore } from '@/stores'
import { getHeatmapColor } from '@/types'
import { MapTooltip } from './MapTooltip'
import { SIDO_CONFIG } from './sidoConfig'

const SIGUNGU_GEO_URL = '/data/geojson/korea/sigungu.json'

interface RegionMapProps {
  sidoName: string
  recordCounts?: Record<string, number>
  onSigunguClick?: (name: string, code: string) => void
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
  z-index: 1;
  background-color: ${({ theme }) => theme.colors?.background ?? '#ffffff'};

  svg {
    touch-action: none;
    width: 100vw !important;
    height: calc(100vh - ${HEADER_HEIGHT}) !important;
    max-width: none !important;
    max-height: none !important;
  }
`

export const RegionMap = memo(function RegionMap({ sidoName, recordCounts = {}, onSigunguClick }: RegionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const svg = mapRef.current?.querySelector('svg')
    if (svg) {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
  }, [])

  const {
    zoom,
    center,
    hoveredRegion,
    tooltipPosition,
    setZoom,
    setCenter,
    setHoveredRegion,
    setSelectedSigungu,
    openModal,
  } = useMapStore()

  const config = useMemo(() => {
    return SIDO_CONFIG[sidoName] ?? SIDO_CONFIG['서울특별시']
  }, [sidoName])

  const selectedMobileRegionRef = useRef<string | null>(null)

  const handleMouseEnter = useCallback(
    (name: string) => {
      if (isMobile) return
      setHoveredRegion(name)
    },
    [setHoveredRegion, isMobile]
  )

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return
    setHoveredRegion(null)
  }, [setHoveredRegion, isMobile])

  const handleMouseMove = useCallback(
    (event: React.MouseEvent, name: string) => {
      if (isMobile) return
      const bounds = mapRef.current?.getBoundingClientRect()
      if (bounds) {
        setHoveredRegion(name, {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        })
      }
    },
    [setHoveredRegion, isMobile]
  )


  const handleClick = useCallback(
    (name: string, code: string) => {
      setSelectedSigungu(name)
      openModal('region')
      onSigunguClick?.(name, code)
    },
    [setSelectedSigungu, openModal, onSigunguClick]
  )

  const handleMobileTap = useCallback(
    (event: React.PointerEvent, name: string, code: string) => {
      if (!isMobile || event.pointerType !== 'touch') return

      const bounds = mapRef.current?.getBoundingClientRect()

      if (selectedMobileRegionRef.current === name) {
        // 두 번째 탭 - 모달 열기
        setHoveredRegion(null)
        selectedMobileRegionRef.current = null
        setSelectedSigungu(name)
        openModal('region')
        onSigunguClick?.(name, code)
      } else {
        // 첫 번째 탭 - 호버 상태 표시
        selectedMobileRegionRef.current = name
        if (bounds) {
          setHoveredRegion(name, {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          })
        }
      }
    },
    [isMobile, setSelectedSigungu, openModal, onSigunguClick, setHoveredRegion]
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
          scale: config.scale * 1,
          center: config.center,
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
          <Geographies geography={SIGUNGU_GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  const code = geo.properties.code as string
                  return code.startsWith(config.codePrefix)
                })
                .map((geo) => {
                  const name = geo.properties.name as string
                  const code = geo.properties.code as string
                  const count = recordCounts[name] ?? 0
                  const isHovered = hoveredRegion === name

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => !isMobile && handleClick(name, code)}
                      onMouseEnter={() => handleMouseEnter(name)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={(e) => handleMouseMove(e, name)}
                      onPointerUp={(e) => handleMobileTap(e as unknown as React.PointerEvent, name, code)}
                      style={{
                        default: {
                          fill: isHovered ? '#60A5FA' : getHeatmapColor(count),
                          stroke: isHovered ? '#6B7280' : '#9CA3AF',
                          strokeWidth: isHovered ? 1 : 0.5,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                        },
                        hover: {
                          fill: isHovered ? '#60A5FA' : getHeatmapColor(count),
                          stroke: '#6B7280',
                          strokeWidth: 1,
                          outline: 'none',
                          filter: isMobile ? 'none' : 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
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

RegionMap.displayName = 'RegionMap'
