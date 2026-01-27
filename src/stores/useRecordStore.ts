import { create } from 'zustand'
import type { Record, Country } from '@/types'

interface RecordState {
  records: Record[]
  selectedRecord: Record | null
  isLoading: boolean
  error: string | null

  // Actions
  setRecords: (records: Record[]) => void
  addRecord: (record: Record) => void
  updateRecord: (id: string, updates: Partial<Record>) => void
  deleteRecord: (id: string) => void
  setSelectedRecord: (record: Record | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed helpers
  getRecordsBySido: (sido: string, country?: Country) => Record[]
  getRecordsBySigungu: (sido: string, sigungu: string, country?: Country) => Record[]
  getRecordCountBySido: (sido: string, country?: Country) => number
  getRecordCountBySigungu: (sido: string, sigungu: string, country?: Country) => number
  getRecordsByCountry: (country: Country) => Record[]
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  selectedRecord: null,
  isLoading: false,
  error: null,

  setRecords: (records) => set({ records }),

  addRecord: (record) =>
    set((state) => ({
      records: [...state.records, record],
    })),

  updateRecord: (id, updates) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      ),
    })),

  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
      selectedRecord: state.selectedRecord?.id === id ? null : state.selectedRecord,
    })),

  setSelectedRecord: (record) => set({ selectedRecord: record }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  getRecordsBySido: (sido, country) => {
    const records = get().records
    if (country) {
      return records.filter((r) => r.sido === sido && r.country === country)
    }
    return records.filter((r) => r.sido === sido)
  },

  getRecordsBySigungu: (sido, sigungu, country) => {
    const records = get().records
    if (country) {
      return records.filter(
        (r) => r.sido === sido && r.sigungu === sigungu && r.country === country
      )
    }
    return records.filter((r) => r.sido === sido && r.sigungu === sigungu)
  },

  getRecordCountBySido: (sido, country) => {
    const records = get().records
    if (country) {
      return records.filter((r) => r.sido === sido && r.country === country).length
    }
    return records.filter((r) => r.sido === sido).length
  },

  getRecordCountBySigungu: (sido, sigungu, country) => {
    const records = get().records
    if (country) {
      return records.filter(
        (r) => r.sido === sido && r.sigungu === sigungu && r.country === country
      ).length
    }
    return records.filter((r) => r.sido === sido && r.sigungu === sigungu).length
  },

  getRecordsByCountry: (country) => {
    return get().records.filter((r) => r.country === country)
  },
}))
