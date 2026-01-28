import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MapLevel, ModalType, TooltipPosition, Country } from '@/types'

// ZoomableGroup default center (viewport offset, not geo coordinates)
const DEFAULT_CENTER: [number, number] = [0, 0]

interface MapState {
  // Current view
  selectedCountry: Country
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
  setCountry: (country: Country) => void
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
  selectedCountry: 'korea' as Country,
  currentLevel: 'country' as MapLevel,
  selectedSido: null,
  selectedSigungu: null,
  zoom: 1,
  center: DEFAULT_CENTER,
  hoveredRegion: null,
  tooltipPosition: null,
  isModalOpen: false,
  modalType: null,
  modalRecordId: null,
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      ...initialState,

      setCountry: (country) =>
        set({
          selectedCountry: country,
          currentLevel: 'country',
          selectedSido: null,
          selectedSigungu: null,
          zoom: 1,
          center: DEFAULT_CENTER,
        }),

      setCurrentLevel: (level) => set({ currentLevel: level }),

      setSelectedSido: (sido) => set({ selectedSido: sido }),

      setSelectedSigungu: (sigungu) => set({ selectedSigungu: sigungu }),

      setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(8, zoom)) }),

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
          center: DEFAULT_CENTER,
        }),

      drillUp: () =>
        set({
          currentLevel: 'country',
          selectedSido: null,
          selectedSigungu: null,
          zoom: 1,
          center: DEFAULT_CENTER,
        }),
    }),
    {
      name: 'chizu-map',
      // UI 상태는 저장하지 않음
      partialize: (state) => ({
        selectedCountry: state.selectedCountry,
        currentLevel: state.currentLevel,
        selectedSido: state.selectedSido,
        selectedSigungu: state.selectedSigungu,
      }),
    }
  )
)
