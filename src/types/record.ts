export type Category = 'cafe' | 'restaurant' | 'travel' | 'culture' | 'etc'

export type Country = 'korea' | 'japan'

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
  visitedAt: string
}
