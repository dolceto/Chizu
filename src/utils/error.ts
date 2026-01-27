export class ChizuError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ChizuError'
  }
}

export type ErrorCode =
  | 'DB_ERROR'
  | 'GEOJSON_LOAD_ERROR'
  | 'RECORD_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface ErrorResult {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: unknown
  }
}

export interface SuccessResult<T> {
  success: true
  data: T
}

export type Result<T> = SuccessResult<T> | ErrorResult

export function createError(
  code: ErrorCode,
  message: string,
  details?: unknown
): ErrorResult {
  return {
    success: false,
    error: { code, message, details },
  }
}

export function createSuccess<T>(data: T): SuccessResult<T> {
  return {
    success: true,
    data,
  }
}

export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorCode: ErrorCode = 'UNKNOWN_ERROR'
): Promise<Result<T>> {
  try {
    const data = await fn()
    return createSuccess(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return createError(errorCode, message, error)
  }
}

export function getErrorMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    DB_ERROR: '데이터베이스 오류가 발생했습니다.',
    GEOJSON_LOAD_ERROR: '지도 데이터를 불러오는데 실패했습니다.',
    RECORD_NOT_FOUND: '기록을 찾을 수 없습니다.',
    VALIDATION_ERROR: '입력값이 올바르지 않습니다.',
    NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  }
  return messages[code]
}
