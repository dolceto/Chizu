export interface IslandConfig {
  name: string // 섬/제도 이름 (한글)
  nameJa: string // 일본어 이름
  center: [number, number]
  scale: number
}

interface PrefectureConfig {
  codePrefix: string
  center: [number, number]
  scale: number
  islands?: IslandConfig[]
}

// 도도부현별 지도 설정 (시구정촌 레벨용)
// 한국 sidoConfig 참고: 경상북도(2도 범위) = scale 35000
// 일본 각 현의 좌표 범위에 맞게 scale 계산: scale = 50000 / maxRange
export const PREFECTURE_CONFIG: Record<string, PrefectureConfig> = {
  北海道: {
    codePrefix: '01',
    center: [143.0, 43.2],
    scale: 6000, // 매우 넓은 범위
  },
  青森県: {
    codePrefix: '02',
    center: [140.77, 40.88],
    scale: 20000,
  },
  岩手県: {
    codePrefix: '03',
    center: [141.36, 39.6],
    scale: 20000,
  },
  宮城県: {
    codePrefix: '04',
    center: [140.97, 38.39],
    scale: 22000,
  },
  秋田県: {
    codePrefix: '05',
    center: [140.34, 39.69],
    scale: 18000,
  },
  山形県: {
    codePrefix: '06',
    center: [140.09, 38.47],
    scale: 20000,
  },
  福島県: {
    codePrefix: '07',
    center: [140.1, 37.38],
    scale: 24000,
  },
  茨城県: {
    codePrefix: '08',
    center: [140.27, 36.34],
    scale: 35000,
  },
  栃木県: {
    codePrefix: '09',
    center: [139.81, 36.68],
    scale: 35000,
  },
  群馬県: {
    codePrefix: '10',
    center: [139.03, 36.52],
    scale: 34000,
  },
  埼玉県: {
    codePrefix: '11',
    center: [139.5, 35.95],
    scale: 42000,
  },
  千葉県: {
    codePrefix: '12',
    center: [140.2, 35.5],
    scale: 35000,
  },
  東京都: {
    codePrefix: '13',
    center: [139.5, 35.68],
    scale: 50000, // 본토 중심
    islands: [
      {
        name: '이즈 제도',
        nameJa: '伊豆諸島',
        center: [139.4, 34.4],
        scale: 19000,
      },
      {
        name: '오가사와라 제도',
        nameJa: '小笠原諸島',
        center: [142.2, 27.1],
        scale: 11000,
      },
    ],
  },
  神奈川県: {
    codePrefix: '14',
    center: [139.4, 35.4],
    scale: 52000,
  },
  新潟県: {
    codePrefix: '15',
    center: [139.0, 37.5],
    scale: 16000, // 세로로 긴 형태
  },
  富山県: {
    codePrefix: '16',
    center: [137.27, 36.63],
    scale: 40000,
  },
  石川県: {
    codePrefix: '17',
    center: [136.8, 36.96],
    scale: 24000, // 세로로 긴 형태
  },
  福井県: {
    codePrefix: '18',
    center: [136.14, 35.82],
    scale: 32000,
  },
  山梨県: {
    codePrefix: '19',
    center: [138.66, 35.57],
    scale: 42000,
  },
  長野県: {
    codePrefix: '20',
    center: [138.1, 36.0],
    scale: 21000, // 큰 현
  },
  岐阜県: {
    codePrefix: '21',
    center: [137.0, 35.75],
    scale: 28000,
  },
  静岡県: {
    codePrefix: '22',
    center: [138.3, 35.0],
    scale: 24000, // 가로로 긴 형태
  },
  愛知県: {
    codePrefix: '23',
    center: [137.1, 35.0],
    scale: 38000,
  },
  三重県: {
    codePrefix: '24',
    center: [136.4, 34.5],
    scale: 28000, // 세로로 긴 형태
  },
  滋賀県: {
    codePrefix: '25',
    center: [136.1, 35.2],
    scale: 42000,
  },
  京都府: {
    codePrefix: '26',
    center: [135.5, 35.2],
    scale: 32000,
  },
  大阪府: {
    codePrefix: '27',
    center: [135.5, 34.65],
    scale: 56000, // 작은 부
  },
  兵庫県: {
    codePrefix: '28',
    center: [135.0, 35.0],
    scale: 26000, // 큰 현
  },
  奈良県: {
    codePrefix: '29',
    center: [135.88, 34.32],
    scale: 42000,
  },
  和歌山県: {
    codePrefix: '30',
    center: [135.5, 33.9],
    scale: 35000,
  },
  鳥取県: {
    codePrefix: '31',
    center: [133.83, 35.33],
    scale: 35000,
  },
  島根県: {
    codePrefix: '32',
    center: [132.5, 35.1],
    scale: 19000, // 가로로 긴 형태
    islands: [
      {
        name: '오키 제도',
        nameJa: '隠岐諸島',
        center: [133.1, 36.2],
        scale: 30000,
      },
    ],
  },
  岡山県: {
    codePrefix: '33',
    center: [133.84, 34.83],
    scale: 35000,
  },
  広島県: {
    codePrefix: '34',
    center: [132.75, 34.58],
    scale: 28000,
  },
  山口県: {
    codePrefix: '35',
    center: [131.5, 34.2],
    scale: 26000,
  },
  徳島県: {
    codePrefix: '36',
    center: [134.24, 33.9],
    scale: 38000,
  },
  香川県: {
    codePrefix: '37',
    center: [133.98, 34.29],
    scale: 50000, // 작은 현
  },
  愛媛県: {
    codePrefix: '38',
    center: [132.86, 33.6],
    scale: 28000,
  },
  高知県: {
    codePrefix: '39',
    center: [133.4, 33.4],
    scale: 24000, // 가로로 긴 형태
  },
  福岡県: {
    codePrefix: '40',
    center: [130.6, 33.55],
    scale: 35000,
  },
  佐賀県: {
    codePrefix: '41',
    center: [130.14, 33.29],
    scale: 46000, // 작은 현
  },
  長崎県: {
    codePrefix: '42',
    center: [129.9, 33.0],
    scale: 21000, // 도서 지역 포함
    islands: [
      {
        name: '고토 열도',
        nameJa: '五島列島',
        center: [128.8, 32.7],
        scale: 22000,
      },
      {
        name: '이키/쓰시마',
        nameJa: '壱岐・対馬',
        center: [129.5, 34.3],
        scale: 19000,
      },
    ],
  },
  熊本県: {
    codePrefix: '43',
    center: [130.8, 32.7],
    scale: 28000,
  },
  大分県: {
    codePrefix: '44',
    center: [131.45, 33.23],
    scale: 32000,
  },
  宮崎県: {
    codePrefix: '45',
    center: [131.3, 32.2],
    scale: 28000,
  },
  鹿児島県: {
    codePrefix: '46',
    center: [130.5, 31.6],
    scale: 19000, // 도서 지역 포함
    islands: [
      {
        name: '야쿠시마/타네가시마',
        nameJa: '屋久島・種子島',
        center: [130.5, 30.4],
        scale: 22000,
      },
      {
        name: '아마미 군도',
        nameJa: '奄美群島',
        center: [129.5, 28.3],
        scale: 14000,
      },
    ],
  },
  沖縄県: {
    codePrefix: '47',
    center: [127.8, 26.5],
    scale: 21000, // 도서 지역 포함
    islands: [
      {
        name: '미야코 제도',
        nameJa: '宮古諸島',
        center: [125.3, 24.8],
        scale: 26000,
      },
      {
        name: '야에야마 제도',
        nameJa: '八重山諸島',
        center: [124.2, 24.4],
        scale: 22000,
      },
      {
        name: '다이토 제도',
        nameJa: '大東諸島',
        center: [131.2, 25.85],
        scale: 38000,
      },
    ],
  },
}
