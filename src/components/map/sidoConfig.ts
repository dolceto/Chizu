interface SidoConfig {
  codePrefix: string
  center: [number, number]
  scale: number
}

export const SIDO_CONFIG: Record<string, SidoConfig> = {
  '서울특별시': {
    codePrefix: '11',
    center: [127.0, 37.56],
    scale: 220000,
  },
  '부산광역시': {
    codePrefix: '21',
    center: [129.03, 35.15],
    scale: 175000,
  },
  '대구광역시': {
    codePrefix: '22',
    center: [128.6, 35.87],
    scale: 150000,
  },
  '인천광역시': {
    codePrefix: '23',
    center: [126.65, 37.46],
    scale: 125000,
  },
  '광주광역시': {
    codePrefix: '24',
    center: [126.85, 35.16],
    scale: 220000,
  },
  '대전광역시': {
    codePrefix: '25',
    center: [127.38, 36.35],
    scale: 220000,
  },
  '울산광역시': {
    codePrefix: '26',
    center: [129.31, 35.54],
    scale: 150000,
  },
  '세종특별자치시': {
    codePrefix: '29',
    center: [127.0, 36.48],
    scale: 200000,
  },
  '경기도': {
    codePrefix: '31',
    center: [127.2, 37.4],
    scale: 60000,
  },
  '강원특별자치도': {
    codePrefix: '32',
    center: [128.2, 37.7],
    scale: 40000,
  },
  '충청북도': {
    codePrefix: '33',
    center: [127.7, 36.8],
    scale: 50000,
  },
  '충청남도': {
    codePrefix: '34',
    center: [126.8, 36.5],
    scale: 50000,
  },
  '전북특별자치도': {
    codePrefix: '35',
    center: [127.1, 35.7],
    scale: 50000,
  },
  '전라남도': {
    codePrefix: '36',
    center: [126.9, 34.8],
    scale: 40000,
  },
  '경상북도': {
    codePrefix: '37',
    center: [128.8, 36.3],
    scale: 35000,
  },
  '경상남도': {
    codePrefix: '38',
    center: [128.2, 35.35],
    scale: 45000,
  },
  '제주특별자치도': {
    codePrefix: '39',
    center: [126.55, 33.38],
    scale: 125000,
  },
}
