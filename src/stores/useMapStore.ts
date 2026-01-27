import { create } from 'zustand'
import type { MapLevel, ModalType, TooltipPosition } from '@/types'

// Korea center coordinates [longitude, latitude]
const KOREA_CENTER: [number, number] = [127.7669, 35.9078]

interface MapState {
  // Current view
  currentLevel: MapLevel
  selectedSido: string | null
  selectedSigungu: string | null

  // Zoom & Pan
  zoom: number
  center: [number, number]

  // UI state
  hoveredRegion: string | null
  tooltipPosition: TooltipPosition | null
  isModalOpen: boolean
  modalType: ModalType | null
  modalRecordId: string | null

  // Actions
  setCurrentLevel: (level: MapLevel) => void
  setSelectedSido: (sido: string | null) => void
  setSelectedSigungu: (sigungu: string | null) => void
  setZoom: (zoom: number) => void
  setCenter: (center: [number, number]) => void
  setHoveredRegion: (region: string | null, position?: TooltipPosition) => void
  openModal: (type: ModalType, recordId?: string) => void
  closeModal: () => void
  resetView: () => void
  drillDown: (sido: string) => void
  drillUp: () => void
}

const initialState = {
  currentLevel: 'country' as MapLevel,
  selectedSido: null,
  selectedSigungu: null,
  zoom: 1,
  center: KOREA_CENTER,
  hoveredRegion: null,
  tooltipPosition: null,
  isModalOpen: false,
  modalType: null,
  modalRecordId: null,
}

export const useMapStore = create<MapState>((set) => ({
  ...initialState,

  setCurrentLevel: (level) => set({ currentLevel: level }),

  setSelectedSido: (sido) => set({ selectedSido: sido }),

  setSelectedSigungu: (sigungu) => set({ selectedSigungu: sigungu }),

  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(4, zoom)) }),

  setCenter: (center) => set({ center }),

  setHoveredRegion: (region, position) =>
    set({
      hoveredRegion: region,
      tooltipPosition: position ?? null,
    }),

  openModal: (type, recordId) =>
    set({
      isModalOpen: true,
      modalType: type,
      modalRecordId: recordId ?? null,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalType: null,
      modalRecordId: null,
    }),

  resetView: () => set(initialState),

  drillDown: (sido) =>
    set({
      currentLevel: 'sido',
      selectedSido: sido,
      selectedSigungu: null,
      zoom: 1,
      center: KOREA_CENTER,
    }),

  drillUp: () =>
    set({
      currentLevel: 'country',
      selectedSido: null,
      selectedSigungu: null,
      zoom: 1,
      center: KOREA_CENTER,
    }),
}))
