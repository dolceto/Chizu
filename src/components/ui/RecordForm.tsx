import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useRecordStore, useMapStore } from '@/stores'
import { createRecord, updateRecord, getRecordById } from '@/db/records'
import type { Category, RecordInput, Country } from '@/types'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'cafe', label: '카페' },
  { value: 'restaurant', label: '음식점' },
  { value: 'travel', label: '여행' },
  { value: 'culture', label: '문화' },
  { value: 'etc', label: '기타' },
]

interface RecordFormProps {
  sido: string
  sigungu: string
  recordId?: string
  onSuccess: () => void
  onCancel: () => void
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.md ?? '16px'};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.xs ?? '4px'};
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
`

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'} ${({ theme }) => theme.spacing?.md ?? '16px'};
  border: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  border-radius: 6px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  }
`

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'} ${({ theme }) => theme.spacing?.md ?? '16px'};
  border: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  border-radius: 6px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
  }
`

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'} ${({ theme }) => theme.spacing?.md ?? '16px'};
  border: 1px solid ${({ theme }) => theme.colors?.border ?? '#E5E7EB'};
  border-radius: 6px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors?.text ?? '#111827'};
  background-color: ${({ theme }) => theme.colors?.background ?? '#FFFFFF'};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
  }
`

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'} ${({ theme }) => theme.spacing?.md ?? '16px'};
  background-color: ${({ theme }) => theme.colors?.surface ?? '#F9FAFB'};
  border-radius: 6px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors?.secondary ?? '#6B7280'};
`

const CountryFlag = styled.span`
  font-size: 1rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.sm ?? '8px'};
  margin-top: ${({ theme }) => theme.spacing?.sm ?? '8px'};
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing?.sm ?? '8px'} ${({ theme }) => theme.spacing?.md ?? '16px'};
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === 'secondary' ? (theme.colors?.border ?? '#E5E7EB') : 'transparent'};
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${({ theme, $variant }) =>
    $variant === 'secondary' ? 'transparent' : (theme.colors?.primary ?? '#3B82F6')};
  color: ${({ theme, $variant }) =>
    $variant === 'secondary' ? (theme.colors?.text ?? '#111827') : 'white'};

  &:hover {
    opacity: ${({ $variant }) => ($variant === 'secondary' ? 1 : 0.9)};
    background-color: ${({ theme, $variant }) =>
      $variant === 'secondary'
        ? (theme.colors?.border ?? '#E5E7EB')
        : (theme.colors?.primary ?? '#3B82F6')};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors?.primary ?? '#3B82F6'};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
`

interface FormState {
  title: string
  memo: string
  category: Category
  visitedAt: string
  address: string
}

const initialFormState: FormState = {
  title: '',
  memo: '',
  category: 'etc',
  visitedAt: new Date().toISOString().split('T')[0],
  address: '',
}

const COUNTRY_FLAGS: Record<Country, string> = {
  korea: '🇰🇷',
  japan: '🇯🇵',
}

export function RecordForm({ sido, sigungu, recordId, onSuccess, onCancel }: RecordFormProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { selectedCountry } = useMapStore()
  const { addRecord: addToStore, updateRecord: updateInStore } = useRecordStore()

  const isEditing = !!recordId

  useEffect(() => {
    if (recordId) {
      const loadRecord = async () => {
        try {
          const record = await getRecordById(recordId)
          if (record) {
            setFormState({
              title: record.title,
              memo: record.memo ?? '',
              category: record.category ?? 'etc',
              visitedAt: record.visitedAt.split('T')[0],
              address: record.address ?? '',
            })
          }
        } catch (error) {
          console.error('Failed to load record:', error)
        }
      }
      loadRecord()
    }
  }, [recordId])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormState((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    },
    []
  )

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}

    if (!formState.title.trim()) {
      newErrors.title = '제목을 입력해주세요'
    } else if (formState.title.length > 100) {
      newErrors.title = '제목은 100자 이내로 입력해주세요'
    }

    if (!formState.visitedAt) {
      newErrors.visitedAt = '방문 날짜를 선택해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formState])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validate()) {
        return
      }

      setIsSubmitting(true)

      try {
        const recordInput: RecordInput = {
          country: selectedCountry,
          sido,
          sigungu,
          title: formState.title.trim(),
          memo: formState.memo.trim() || undefined,
          category: formState.category,
          visitedAt: formState.visitedAt,
          address: formState.address.trim() || undefined,
        }

        if (isEditing && recordId) {
          const updatedRecord = await updateRecord(recordId, recordInput)
          updateInStore(recordId, updatedRecord)
        } else {
          const newRecord = await createRecord(recordInput)
          addToStore(newRecord)
        }

        onSuccess()
      } catch (error) {
        console.error('Failed to save record:', error)
        setErrors({ title: '저장에 실패했습니다. 다시 시도해주세요.' })
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      formState,
      selectedCountry,
      sido,
      sigungu,
      recordId,
      isEditing,
      validate,
      addToStore,
      updateInStore,
      onSuccess,
    ]
  )

  // 일본은 시구정촌이 없으므로 도도부현만 표시
  const locationDisplay =
    selectedCountry === 'japan' ? sigungu || sido : sigungu ? `${sido} ${sigungu}` : sido

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label>위치</Label>
        <LocationInfo>
          <CountryFlag>{COUNTRY_FLAGS[selectedCountry]}</CountryFlag>
          {locationDisplay}
        </LocationInfo>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formState.title}
          onChange={handleChange}
          placeholder="방문 기록 제목"
          maxLength={100}
        />
        {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="visitedAt">방문 날짜 *</Label>
        <Input
          id="visitedAt"
          name="visitedAt"
          type="date"
          value={formState.visitedAt}
          onChange={handleChange}
        />
        {errors.visitedAt && <ErrorMessage>{errors.visitedAt}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">카테고리</Label>
        <Select id="category" name="category" value={formState.category} onChange={handleChange}>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="address">상세 주소</Label>
        <Input
          id="address"
          name="address"
          type="text"
          value={formState.address}
          onChange={handleChange}
          placeholder="상세 주소 (선택)"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="memo">메모</Label>
        <TextArea
          id="memo"
          name="memo"
          value={formState.memo}
          onChange={handleChange}
          placeholder="방문 기록에 대한 메모를 작성하세요"
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="button" $variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : isEditing ? '수정' : '저장'}
        </Button>
      </ButtonGroup>
    </Form>
  )
}
