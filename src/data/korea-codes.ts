/**
 * 한국 행정구역 코드 매핑
 * 통계청 행정구역코드 기준 (2018)
 */

export const SIDO_CODES: Record<string, string> = {
  '11': '서울특별시',
  '21': '부산광역시',
  '22': '대구광역시',
  '23': '인천광역시',
  '24': '광주광역시',
  '25': '대전광역시',
  '26': '울산광역시',
  '29': '세종특별자치시',
  '31': '경기도',
  '32': '강원도',
  '33': '충청북도',
  '34': '충청남도',
  '35': '전라북도',
  '36': '전라남도',
  '37': '경상북도',
  '38': '경상남도',
  '39': '제주특별자치도',
}

export const SIDO_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SIDO_CODES).map(([code, name]) => [name, code])
)

export const SIDO_SHORT_NAMES: Record<string, string> = {
  '서울특별시': '서울',
  '부산광역시': '부산',
  '대구광역시': '대구',
  '인천광역시': '인천',
  '광주광역시': '광주',
  '대전광역시': '대전',
  '울산광역시': '울산',
  '세종특별자치시': '세종',
  '경기도': '경기',
  '강원도': '강원',
  '충청북도': '충북',
  '충청남도': '충남',
  '전라북도': '전북',
  '전라남도': '전남',
  '경상북도': '경북',
  '경상남도': '경남',
  '제주특별자치도': '제주',
}

/**
 * 시/도 코드로 이름 조회
 */
export function getSidoName(code: string): string {
  return SIDO_CODES[code] ?? code
}

/**
 * 시/도 이름으로 코드 조회
 */
export function getSidoCode(name: string): string | undefined {
  return SIDO_NAMES[name]
}

/**
 * 시/군/구 코드에서 시/도 코드 추출 (앞 2자리)
 */
export function extractSidoCode(sigunguCode: string): string {
  return sigunguCode.slice(0, 2)
}

/**
 * 시/군/구 코드가 특정 시/도에 속하는지 확인
 */
export function belongsToSido(sigunguCode: string, sidoCode: string): boolean {
  return sigunguCode.startsWith(sidoCode)
}
