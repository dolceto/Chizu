declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode, SVGProps } from 'react'
  import type { GeoProjection } from 'd3-geo'

  export interface ComposableMapProps extends SVGProps<SVGSVGElement> {
    projection?: string | (() => GeoProjection)
    projectionConfig?: {
      center?: [number, number]
      rotate?: [number, number, number]
      scale?: number
      parallels?: [number, number]
    }
    width?: number
    height?: number
    children?: ReactNode
  }

  export interface GeographiesProps {
    geography: string | object
    children: (data: { geographies: Geography[] }) => ReactNode
  }

  export interface Geography {
    rsmKey: string
    properties: Record<string, unknown>
    geometry: {
      type: string
      coordinates: number[][][] | number[][][][]
    }
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography
    style?: {
      default?: Record<string, string | number>
      hover?: Record<string, string | number>
      pressed?: Record<string, string | number>
    }
  }

  export interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    translateExtent?: [[number, number], [number, number]]
    onMoveStart?: (event: { coordinates: [number, number]; zoom: number }) => void
    onMove?: (event: { coordinates: [number, number]; zoom: number; dragging: boolean }) => void
    onMoveEnd?: (event: { coordinates: [number, number]; zoom: number }) => void
    children?: ReactNode
  }

  export interface MarkerProps extends SVGProps<SVGGElement> {
    coordinates: [number, number]
    children?: ReactNode
  }

  export interface AnnotationProps {
    subject: [number, number]
    dx?: number
    dy?: number
    connectorProps?: SVGProps<SVGPathElement>
    children?: ReactNode
  }

  export interface LineProps extends SVGProps<SVGPathElement> {
    from: [number, number]
    to: [number, number]
    coordinates?: [number, number][]
  }

  export interface GraticuleProps extends SVGProps<SVGPathElement> {
    step?: [number, number]
  }

  export interface SphereProps extends SVGProps<SVGPathElement> {}

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Marker: ComponentType<MarkerProps>
  export const Annotation: ComponentType<AnnotationProps>
  export const Line: ComponentType<LineProps>
  export const Graticule: ComponentType<GraticuleProps>
  export const Sphere: ComponentType<SphereProps>
}
