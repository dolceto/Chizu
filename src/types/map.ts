import type { Country } from './record'

export type MapLevel = 'country' | 'sido'

export interface TooltipPosition {
  x: number
  y: number
}

export type ModalType = 'region' | 'record' | 'form'

export interface MapState {
  // Current view
  selectedCountry: Country
  currentLevel: MapLevel
  selectedSido?: string
  selectedSigungu?: string

  // Zoom & Pan
  zoom: number
  center: [number, number] // [longitude, latitude]

  // UI state
  hoveredRegion?: string
  tooltipPosition?: TooltipPosition
  isModalOpen: boolean
  modalType?: ModalType
  modalRecordId?: string
}

export interface GeoJSONFeature {
  type: 'Feature'
  properties: {
    code: string
    name: string
    name_eng?: string
    base_year?: string
  }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

export interface GeoJSONCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

export interface RegionData {
  code: string
  name: string
  nameEng?: string
  recordCount: number
}

// Heatmap color levels based on max score (통과=1, 방문=3, 숙박=5)
export const HEATMAP_COLORS = {
  0: '#E5E7EB', // gray - no record
  1: '#BFDBFE', // light blue - 통과 (1점)
  3: '#86EFAC', // green - 방문 (3점)
  5: '#FDE047', // yellow - 숙박 (5점)
} as const

export type HeatmapScore = keyof typeof HEATMAP_COLORS

export function getHeatmapColor(score: number): string {
  if (score >= 5) return HEATMAP_COLORS[5]
  if (score >= 3) return HEATMAP_COLORS[3]
  if (score >= 1) return HEATMAP_COLORS[1]
  return HEATMAP_COLORS[0]
}
