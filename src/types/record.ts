export type Category = 'cafe' | 'restaurant' | 'travel' | 'culture' | 'etc'

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
  sido: string
  sigungu: string
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
  sido: string
  sigungu: string
  address?: string
  coordinates?: Coordinates
  title: string
  memo?: string
  category?: Category
  visitedAt: string
}
