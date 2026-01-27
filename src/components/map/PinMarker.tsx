import { memo, useCallback } from 'react'
import { Marker } from 'react-simple-maps'
import styled from 'styled-components'
import type { Record as VisitRecord, Category } from '@/types'

const CATEGORY_COLORS: { [key in Category]: string } = {
  cafe: '#8B4513',
  restaurant: '#DC2626',
  travel: '#2563EB',
  culture: '#7C3AED',
  etc: '#6B7280',
}

interface PinMarkerProps {
  record: VisitRecord
  onClick?: (record: VisitRecord) => void
  isSelected?: boolean
}

const PinContainer = styled.g<{ $isSelected: boolean }>`
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }

  ${({ $isSelected }) =>
    $isSelected &&
    `
    transform: scale(1.3);
  `}
`

function PinMarkerComponent({ record, onClick, isSelected = false }: PinMarkerProps) {
  const coordinates = record.coordinates

  if (!coordinates) {
    return null
  }

  const handleClick = useCallback(() => {
    onClick?.(record)
  }, [record, onClick])

  const color = record.category ? CATEGORY_COLORS[record.category] : CATEGORY_COLORS.etc

  return (
    <Marker coordinates={[coordinates.lng, coordinates.lat]}>
      <PinContainer $isSelected={isSelected} onClick={handleClick}>
        <path
          d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z"
          fill={color}
          stroke="#fff"
          strokeWidth="1.5"
          transform="translate(-12, -21)"
        />
        <circle cx="0" cy="-13" r="3" fill="#fff" />
      </PinContainer>
    </Marker>
  )
}

export const PinMarker = memo(PinMarkerComponent)

interface PinMarkersProps {
  records: VisitRecord[]
  onPinClick?: (record: VisitRecord) => void
  selectedRecordId?: string | null
}

function PinMarkersComponent({ records, onPinClick, selectedRecordId }: PinMarkersProps) {
  const recordsWithCoordinates = records.filter((r) => r.coordinates)

  if (recordsWithCoordinates.length === 0) {
    return null
  }

  return (
    <>
      {recordsWithCoordinates.map((record) => (
        <PinMarker
          key={record.id}
          record={record}
          onClick={onPinClick}
          isSelected={record.id === selectedRecordId}
        />
      ))}
    </>
  )
}

export const PinMarkers = memo(PinMarkersComponent)
