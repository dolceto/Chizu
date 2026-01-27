interface PrefectureConfig {
  codePrefix: string
  center: [number, number]
  scale: number
}

// 도도부현별 지도 설정 (시구정촌 레벨용)
export const PREFECTURE_CONFIG: Record<string, PrefectureConfig> = {
  北海道: {
    codePrefix: '01',
    center: [143.0, 43.0],
    scale: 8000,
  },
  青森県: {
    codePrefix: '02',
    center: [140.7, 40.8],
    scale: 35000,
  },
  岩手県: {
    codePrefix: '03',
    center: [141.2, 39.5],
    scale: 25000,
  },
  宮城県: {
    codePrefix: '04',
    center: [141.0, 38.3],
    scale: 35000,
  },
  秋田県: {
    codePrefix: '05',
    center: [140.1, 39.7],
    scale: 30000,
  },
  山形県: {
    codePrefix: '06',
    center: [140.0, 38.2],
    scale: 35000,
  },
  福島県: {
    codePrefix: '07',
    center: [140.1, 37.4],
    scale: 25000,
  },
  茨城県: {
    codePrefix: '08',
    center: [140.2, 36.3],
    scale: 40000,
  },
  栃木県: {
    codePrefix: '09',
    center: [139.9, 36.7],
    scale: 40000,
  },
  群馬県: {
    codePrefix: '10',
    center: [139.0, 36.5],
    scale: 40000,
  },
  埼玉県: {
    codePrefix: '11',
    center: [139.5, 35.9],
    scale: 60000,
  },
  千葉県: {
    codePrefix: '12',
    center: [140.1, 35.5],
    scale: 45000,
  },
  東京都: {
    codePrefix: '13',
    center: [139.7, 35.7],
    scale: 80000,
  },
  神奈川県: {
    codePrefix: '14',
    center: [139.4, 35.4],
    scale: 80000,
  },
  新潟県: {
    codePrefix: '15',
    center: [139.0, 37.5],
    scale: 20000,
  },
  富山県: {
    codePrefix: '16',
    center: [137.2, 36.7],
    scale: 50000,
  },
  石川県: {
    codePrefix: '17',
    center: [136.7, 36.8],
    scale: 35000,
  },
  福井県: {
    codePrefix: '18',
    center: [136.2, 35.9],
    scale: 40000,
  },
  山梨県: {
    codePrefix: '19',
    center: [138.6, 35.6],
    scale: 55000,
  },
  長野県: {
    codePrefix: '20',
    center: [138.2, 36.0],
    scale: 25000,
  },
  岐阜県: {
    codePrefix: '21',
    center: [137.0, 35.7],
    scale: 30000,
  },
  静岡県: {
    codePrefix: '22',
    center: [138.3, 35.0],
    scale: 30000,
  },
  愛知県: {
    codePrefix: '23',
    center: [137.1, 35.0],
    scale: 45000,
  },
  三重県: {
    codePrefix: '24',
    center: [136.5, 34.5],
    scale: 30000,
  },
  滋賀県: {
    codePrefix: '25',
    center: [136.1, 35.2],
    scale: 55000,
  },
  京都府: {
    codePrefix: '26',
    center: [135.5, 35.2],
    scale: 35000,
  },
  大阪府: {
    codePrefix: '27',
    center: [135.5, 34.6],
    scale: 70000,
  },
  兵庫県: {
    codePrefix: '28',
    center: [135.0, 35.0],
    scale: 30000,
  },
  奈良県: {
    codePrefix: '29',
    center: [135.9, 34.4],
    scale: 50000,
  },
  和歌山県: {
    codePrefix: '30',
    center: [135.5, 33.9],
    scale: 35000,
  },
  鳥取県: {
    codePrefix: '31',
    center: [134.0, 35.4],
    scale: 45000,
  },
  島根県: {
    codePrefix: '32',
    center: [132.5, 35.1],
    scale: 25000,
  },
  岡山県: {
    codePrefix: '33',
    center: [133.8, 34.7],
    scale: 40000,
  },
  広島県: {
    codePrefix: '34',
    center: [132.5, 34.5],
    scale: 30000,
  },
  山口県: {
    codePrefix: '35',
    center: [131.5, 34.2],
    scale: 30000,
  },
  徳島県: {
    codePrefix: '36',
    center: [134.3, 33.9],
    scale: 45000,
  },
  香川県: {
    codePrefix: '37',
    center: [134.0, 34.3],
    scale: 70000,
  },
  愛媛県: {
    codePrefix: '38',
    center: [132.8, 33.7],
    scale: 35000,
  },
  高知県: {
    codePrefix: '39',
    center: [133.3, 33.5],
    scale: 25000,
  },
  福岡県: {
    codePrefix: '40',
    center: [130.5, 33.5],
    scale: 40000,
  },
  佐賀県: {
    codePrefix: '41',
    center: [130.0, 33.3],
    scale: 55000,
  },
  長崎県: {
    codePrefix: '42',
    center: [129.8, 33.0],
    scale: 30000,
  },
  熊本県: {
    codePrefix: '43',
    center: [130.8, 32.8],
    scale: 30000,
  },
  大分県: {
    codePrefix: '44',
    center: [131.5, 33.2],
    scale: 35000,
  },
  宮崎県: {
    codePrefix: '45',
    center: [131.4, 32.2],
    scale: 30000,
  },
  鹿児島県: {
    codePrefix: '46',
    center: [130.5, 31.5],
    scale: 20000,
  },
  沖縄県: {
    codePrefix: '47',
    center: [127.8, 26.5],
    scale: 25000,
  },
}
