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

// Heatmap color levels
export const HEATMAP_COLORS = {
  0: '#E5E7EB', // gray - 0 visits
  1: '#BFDBFE', // light blue - 1-5 visits
  2: '#86EFAC', // green - 6-20 visits
  3: '#FDE047', // yellow - 21-50 visits
  4: '#FB923C', // orange - 51-100 visits
  5: '#F87171', // red - 100+ visits
} as const

export type HeatmapLevel = keyof typeof HEATMAP_COLORS

export function getHeatmapLevel(count: number): HeatmapLevel {
  if (count === 0) return 0
  if (count <= 5) return 1
  if (count <= 20) return 2
  if (count <= 50) return 3
  if (count <= 100) return 4
  return 5
}

export function getHeatmapColor(count: number): string {
  return HEATMAP_COLORS[getHeatmapLevel(count)]
}
