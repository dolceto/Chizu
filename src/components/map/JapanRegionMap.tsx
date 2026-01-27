import { useRef, useCallback, useMemo, useEffect, useState, memo } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom'
import { select } from 'd3-selection'
import styled from 'styled-components'
import { useMapStore } from '@/stores'
import { getHeatmapColor } from '@/types'
import { MapTooltip } from './MapTooltip'
import { PREFECTURE_CONFIG } from './prefectureConfig'
import { getMunicipalityNameKo } from './japaneseToKorean'
import type { Feature, FeatureCollection, Geometry } from 'geojson'

const MUNICIPALITIES_GEO_URL = '/data/geojson/japan/municipalities.json'

interface JapanRegionMapProps {
  prefectureName: string
  recordCounts?: Record<string, number>
  onMunicipalityClick?: (name: string, code: string) => void
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
`

const StyledSvg = styled.svg`
  width: 100%;
  height: 100%;
  touch-action: none;
`

const RegionPath = styled.path<{ $isHovered: boolean; $fill: string }>`
  fill: ${({ $isHovered, $fill }) => ($isHovered ? '#60A5FA' : $fill)};
  stroke: ${({ $isHovered }) => ($isHovered ? '#374151' : '#6B7280')};
  stroke-width: ${({ $isHovered }) => ($isHovered ? 2 : 1)};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    fill: ${({ $isHovered, $fill }) => ($isHovered ? '#60A5FA' : $fill)};
    stroke: #374151;
    stroke-width: 2;
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3));
  }
`

interface MunicipalityProperties {
  N03_001?: string
  N03_002?: string
  N03_003?: string
  N03_004?: string
  N03_007?: string
}

function getMunicipalityName(properties: MunicipalityProperties): string {
  return properties.N03_004 || properties.N03_003 || ''
}

function getMunicipalityCode(properties: MunicipalityProperties): string {
  return properties.N03_007 || ''
}

export const JapanRegionMap = memo(function JapanRegionMap({
  prefectureName,
  recordCounts = {},
  onMunicipalityClick,
}: JapanRegionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkMobile()
  }, [])

  useEffect(() => {
    fetch(MUNICIPALITIES_GEO_URL)
      .then((res) => res.json())
      .then(setGeoData)
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Zoom/Pan 설정
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return

    const svg = select(svgRef.current)
    const g = select(gRef.current)

    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on('zoom', (event) => {
        const { x, y, k } = event.transform
        g.attr('transform', `translate(${x},${y}) scale(${k})`)
      })

    svg.call(zoomBehavior)

    // 초기 transform 리셋
    svg.call(zoomBehavior.transform, zoomIdentity)

    return () => {
      svg.on('.zoom', null)
    }
  }, [dimensions])

  const {
    hoveredRegion,
    tooltipPosition,
    setHoveredRegion,
    setSelectedSigungu,
    openModal,
  } = useMapStore()

  const config = useMemo(() => {
    return PREFECTURE_CONFIG[prefectureName] ?? PREFECTURE_CONFIG['東京都']
  }, [prefectureName])

  const selectedMobileRegionRef = useRef<string | null>(null)

  const filteredFeatures = useMemo(() => {
    if (!geoData) return []
    return geoData.features.filter((feature) => {
      const code = getMunicipalityCode(feature.properties as MunicipalityProperties)
      return code.startsWith(config.codePrefix)
    })
  }, [geoData, config.codePrefix])

  const pathGenerator = useMemo(() => {
    if (filteredFeatures.length === 0) return null

    // 모든 feature의 좌표 범위 계산
    let minLon = Infinity,
      maxLon = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity

    const extractCoords = (arr: unknown[]): void => {
      if (
        Array.isArray(arr) &&
        arr.length >= 2 &&
        typeof arr[0] === 'number' &&
        typeof arr[1] === 'number'
      ) {
        const [lon, lat] = arr as [number, number]
        if (lon < minLon) minLon = lon
        if (lon > maxLon) maxLon = lon
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      } else if (Array.isArray(arr)) {
        arr.forEach((item) => extractCoords(item as unknown[]))
      }
    }

    for (const feature of filteredFeatures) {
      extractCoords(
        (feature as Feature<Geometry>).geometry.coordinates as unknown[]
      )
    }

    if (minLon === Infinity) return null

    // 중심점과 크기 계산
    const centerLon = (minLon + maxLon) / 2
    const centerLat = (minLat + maxLat) / 2
    const lonRange = maxLon - minLon
    const latRange = maxLat - minLat

    // 화면에 맞는 scale 계산 (여백 포함)
    const padding = 80
    const availableWidth = dimensions.width - padding * 2
    const availableHeight = dimensions.height - padding * 2

    // Mercator projection에서 위도에 따른 왜곡 보정
    const latRad = (centerLat * Math.PI) / 180
    const mercatorScale = 1 / Math.cos(latRad)

    // 경도 1도당 픽셀 수와 위도 1도당 픽셀 수 계산
    const scaleX = availableWidth / lonRange
    const scaleY = availableHeight / (latRange * mercatorScale)
    const scale = Math.min(scaleX, scaleY) * 0.9 // 약간의 여유

    // Mercator projection 생성
    const proj = geoMercator()
      .center([centerLon, centerLat])
      .scale(scale * 60) // Mercator의 기본 scale 보정
      .translate([dimensions.width / 2, dimensions.height / 2])

    return geoPath().projection(proj)
  }, [filteredFeatures, dimensions.width, dimensions.height])

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
      onMunicipalityClick?.(name, code)
    },
    [setSelectedSigungu, openModal, onMunicipalityClick]
  )

  const handleMobileTap = useCallback(
    (event: React.PointerEvent, name: string, code: string) => {
      if (!isMobile || event.pointerType !== 'touch') return

      const bounds = mapRef.current?.getBoundingClientRect()

      if (selectedMobileRegionRef.current === name) {
        setHoveredRegion(null)
        selectedMobileRegionRef.current = null
        setSelectedSigungu(name)
        openModal('region')
        onMunicipalityClick?.(name, code)
      } else {
        selectedMobileRegionRef.current = name
        if (bounds) {
          setHoveredRegion(name, {
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          })
        }
      }
    },
    [isMobile, setSelectedSigungu, openModal, onMunicipalityClick, setHoveredRegion]
  )

  return (
    <MapContainer ref={mapRef}>
      <StyledSvg ref={svgRef} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <g ref={gRef}>
        {filteredFeatures.map((feature, index) => {
          const properties = feature.properties as MunicipalityProperties
          const name = getMunicipalityName(properties)
          const nameKo = getMunicipalityNameKo(name)
          const code = getMunicipalityCode(properties)
          const count = recordCounts[nameKo] ?? recordCounts[name] ?? 0
          const isHovered = hoveredRegion === nameKo

          if (!name) return null

          let d = pathGenerator(feature as Feature<Geometry>)
          if (!d) return null

          // d3-geo가 추가하는 클리핑 사각형 제거 (첫 번째 Z까지만 사용)
          const firstZIndex = d.indexOf('Z')
          if (firstZIndex !== -1 && d.indexOf('M', firstZIndex) !== -1) {
            d = d.substring(0, firstZIndex + 1)
          }

          return (
            <RegionPath
              key={`${code}-${index}`}
              d={d}
              $isHovered={isHovered}
              $fill={getHeatmapColor(count)}
              onClick={() => !isMobile && handleClick(nameKo, code)}
              onMouseEnter={() => handleMouseEnter(nameKo)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={(e) => handleMouseMove(e, nameKo)}
              onPointerUp={(e) => handleMobileTap(e, nameKo, code)}
            />
          )
        })}
        </g>
      </StyledSvg>

      <MapTooltip region={hoveredRegion} position={tooltipPosition} />
    </MapContainer>
  )
})

JapanRegionMap.displayName = 'JapanRegionMap'
