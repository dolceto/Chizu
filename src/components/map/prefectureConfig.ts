interface PrefectureConfig {
  codePrefix: string
  center: [number, number]
  scale: number
}

// 도도부현별 지도 설정 (시구정촌 레벨용)
// 한국 sidoConfig 참고: 경상북도(2도 범위) = scale 35000
// 일본 각 현의 좌표 범위에 맞게 scale 계산: scale = 70000 / maxRange
export const PREFECTURE_CONFIG: Record<string, PrefectureConfig> = {
  北海道: {
    codePrefix: '01',
    center: [143.0, 43.2],
    scale: 8000, // 매우 넓은 범위
  },
  青森県: {
    codePrefix: '02',
    center: [140.77, 40.88],
    scale: 38000,
  },
  岩手県: {
    codePrefix: '03',
    center: [141.36, 39.6],
    scale: 35000,
  },
  宮城県: {
    codePrefix: '04',
    center: [140.97, 38.39],
    scale: 42000,
  },
  秋田県: {
    codePrefix: '05',
    center: [140.34, 39.69],
    scale: 37000,
  },
  山形県: {
    codePrefix: '06',
    center: [140.09, 38.47],
    scale: 40000,
  },
  福島県: {
    codePrefix: '07',
    center: [140.1, 37.38],
    scale: 32000,
  },
  茨城県: {
    codePrefix: '08',
    center: [140.27, 36.34],
    scale: 47000,
  },
  栃木県: {
    codePrefix: '09',
    center: [139.81, 36.68],
    scale: 47000,
  },
  群馬県: {
    codePrefix: '10',
    center: [139.03, 36.52],
    scale: 45000,
  },
  埼玉県: {
    codePrefix: '11',
    center: [139.5, 35.95],
    scale: 55000,
  },
  千葉県: {
    codePrefix: '12',
    center: [140.2, 35.5],
    scale: 47000,
  },
  東京都: {
    codePrefix: '13',
    center: [139.5, 35.7],
    scale: 95000, // 본토 중심
  },
  神奈川県: {
    codePrefix: '14',
    center: [139.4, 35.4],
    scale: 70000,
  },
  新潟県: {
    codePrefix: '15',
    center: [139.0, 37.5],
    scale: 22000, // 세로로 긴 형태
  },
  富山県: {
    codePrefix: '16',
    center: [137.27, 36.63],
    scale: 52000,
  },
  石川県: {
    codePrefix: '17',
    center: [136.8, 36.96],
    scale: 32000, // 세로로 긴 형태
  },
  福井県: {
    codePrefix: '18',
    center: [136.14, 35.82],
    scale: 42000,
  },
  山梨県: {
    codePrefix: '19',
    center: [138.66, 35.57],
    scale: 55000,
  },
  長野県: {
    codePrefix: '20',
    center: [138.1, 36.0],
    scale: 28000, // 큰 현
  },
  岐阜県: {
    codePrefix: '21',
    center: [137.0, 35.75],
    scale: 38000,
  },
  静岡県: {
    codePrefix: '22',
    center: [138.3, 35.0],
    scale: 32000, // 가로로 긴 형태
  },
  愛知県: {
    codePrefix: '23',
    center: [137.1, 35.0],
    scale: 50000,
  },
  三重県: {
    codePrefix: '24',
    center: [136.4, 34.5],
    scale: 38000, // 세로로 긴 형태
  },
  滋賀県: {
    codePrefix: '25',
    center: [136.1, 35.2],
    scale: 55000,
  },
  京都府: {
    codePrefix: '26',
    center: [135.5, 35.2],
    scale: 42000, // 1.2도 범위
  },
  大阪府: {
    codePrefix: '27',
    center: [135.5, 34.65],
    scale: 75000, // 작은 부
  },
  兵庫県: {
    codePrefix: '28',
    center: [135.0, 35.0],
    scale: 35000, // 큰 현
  },
  奈良県: {
    codePrefix: '29',
    center: [135.88, 34.32],
    scale: 55000,
  },
  和歌山県: {
    codePrefix: '30',
    center: [135.5, 33.9],
    scale: 47000,
  },
  鳥取県: {
    codePrefix: '31',
    center: [133.83, 35.33],
    scale: 47000,
  },
  島根県: {
    codePrefix: '32',
    center: [132.5, 35.1],
    scale: 25000, // 가로로 긴 형태
  },
  岡山県: {
    codePrefix: '33',
    center: [133.84, 34.83],
    scale: 47000,
  },
  広島県: {
    codePrefix: '34',
    center: [132.75, 34.58],
    scale: 38000,
  },
  山口県: {
    codePrefix: '35',
    center: [131.5, 34.2],
    scale: 35000,
  },
  徳島県: {
    codePrefix: '36',
    center: [134.24, 33.9],
    scale: 50000,
  },
  香川県: {
    codePrefix: '37',
    center: [133.98, 34.29],
    scale: 65000, // 작은 현
  },
  愛媛県: {
    codePrefix: '38',
    center: [132.86, 33.6],
    scale: 38000,
  },
  高知県: {
    codePrefix: '39',
    center: [133.4, 33.4],
    scale: 32000, // 가로로 긴 형태
  },
  福岡県: {
    codePrefix: '40',
    center: [130.6, 33.55],
    scale: 47000,
  },
  佐賀県: {
    codePrefix: '41',
    center: [130.14, 33.29],
    scale: 62000, // 작은 현
  },
  長崎県: {
    codePrefix: '42',
    center: [129.9, 33.0],
    scale: 28000, // 도서 지역 포함
  },
  熊本県: {
    codePrefix: '43',
    center: [130.8, 32.7],
    scale: 38000,
  },
  大分県: {
    codePrefix: '44',
    center: [131.45, 33.23],
    scale: 42000,
  },
  宮崎県: {
    codePrefix: '45',
    center: [131.3, 32.2],
    scale: 38000,
  },
  鹿児島県: {
    codePrefix: '46',
    center: [130.5, 31.6],
    scale: 25000, // 도서 지역 포함
  },
  沖縄県: {
    codePrefix: '47',
    center: [127.8, 26.5],
    scale: 28000, // 도서 지역 포함
  },
}
