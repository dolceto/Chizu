export type Category = 'cafe' | 'restaurant' | 'travel' | 'culture' | 'etc'

export type Country = 'korea' | 'japan'

export type VisitType = 'stay' | 'visit' | 'pass'

export const VISIT_TYPE_LABELS: { [K in VisitType]: string } = {
  stay: '숙박',
  visit: '방문',
  pass: '통과',
}

export const VISIT_TYPE_SCORES: { [K in VisitType]: number } = {
  stay: 5,
  visit: 3,
  pass: 1,
}

export const VISIT_TYPE_COLORS: { [K in VisitType]: string } = {
  stay: '#F59E0B',
  visit: '#10B981',
  pass: '#3B82F6',
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Photo {
  id: string
  blob: Blob
  thumbnail?: Blob
}

export interface Record {
  id: string

  // Location
  country: Country
  sido: string // 한국: 시/도, 일본: 도도부현
  sigungu: string // 한국: 시군구, 일본: 시구정촌
  address?: string
  coordinates?: Coordinates

  // Content
  title: string
  memo?: string
  category?: Category
  visitType: VisitType
  photos?: Photo[]

  // Timestamps
  visitedAt: string
  createdAt: string
  updatedAt: string
}

export interface RecordInput {
  country: Country
  sido: string
  sigungu: string
  address?: string
  coordinates?: Coordinates
  title: string
  memo?: string
  category?: Category
  visitType: VisitType
  visitedAt: string
}
