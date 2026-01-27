interface PrefectureConfig {
  codePrefix: string
  center: [number, number]
  scale: number
}

export const PREFECTURE_CONFIG: Record<string, PrefectureConfig> = {
  北海道: {
    codePrefix: '01',
    center: [144.11, 43.45],
    scale: 10000,
  },
  青森県: {
    codePrefix: '02',
    center: [140.77, 40.88],
    scale: 48000,
  },
  岩手県: {
    codePrefix: '03',
    center: [141.36, 39.6],
    scale: 52000,
  },
  宮城県: {
    codePrefix: '04',
    center: [140.97, 38.39],
    scale: 63000,
  },
  秋田県: {
    codePrefix: '05',
    center: [140.34, 39.69],
    scale: 54000,
  },
  山形県: {
    codePrefix: '06',
    center: [140.09, 38.47],
    scale: 60000,
  },
  福島県: {
    codePrefix: '07',
    center: [140.1, 37.38],
    scale: 47000,
  },
  茨城県: {
    codePrefix: '08',
    center: [140.27, 36.34],
    scale: 73000,
  },
  栃木県: {
    codePrefix: '09',
    center: [139.81, 36.68],
    scale: 92000,
  },
  群馬県: {
    codePrefix: '10',
    center: [139.03, 36.52],
    scale: 69000,
  },
  埼玉県: {
    codePrefix: '11',
    center: [139.31, 36.02],
    scale: 74000,
  },
  千葉県: {
    codePrefix: '12',
    center: [140.31, 35.5],
    scale: 73000,
  },
  東京都: {
    codePrefix: '13',
    center: [146.46, 30.06],
    scale: 10000,
  },
  神奈川県: {
    codePrefix: '14',
    center: [139.36, 35.4],
    scale: 100000,
  },
  新潟県: {
    codePrefix: '15',
    center: [138.77, 37.64],
    scale: 39000,
  },
  富山県: {
    codePrefix: '16',
    center: [137.27, 36.63],
    scale: 89000,
  },
  石川県: {
    codePrefix: '17',
    center: [136.8, 36.96],
    scale: 49000,
  },
  福井県: {
    codePrefix: '18',
    center: [136.14, 35.82],
    scale: 64000,
  },
  山梨県: {
    codePrefix: '19',
    center: [138.66, 35.57],
    scale: 92000,
  },
  長野県: {
    codePrefix: '20',
    center: [138.03, 36.11],
    scale: 48000,
  },
  岐阜県: {
    codePrefix: '21',
    center: [136.96, 35.81],
    scale: 64000,
  },
  静岡県: {
    codePrefix: '22',
    center: [138.33, 35.12],
    scale: 52000,
  },
  愛知県: {
    codePrefix: '23',
    center: [137.25, 35],
    scale: 76000,
  },
  三重県: {
    codePrefix: '24',
    center: [136.42, 34.49],
    scale: 57000,
  },
  滋賀県: {
    codePrefix: '25',
    center: [136.11, 35.25],
    scale: 96000,
  },
  京都府: {
    codePrefix: '26',
    center: [135.45, 35.24],
    scale: 74000,
  },
  大阪府: {
    codePrefix: '27',
    center: [135.42, 34.66],
    scale: 113000,
  },
  兵庫県: {
    codePrefix: '28',
    center: [134.86, 34.91],
    scale: 58000,
  },
  奈良県: {
    codePrefix: '29',
    center: [135.88, 34.32],
    scale: 96000,
  },
  和歌山県: {
    codePrefix: '30',
    center: [135.51, 33.91],
    scale: 87000,
  },
  鳥取県: {
    codePrefix: '31',
    center: [133.83, 35.33],
    scale: 64000,
  },
  島根県: {
    codePrefix: '32',
    center: [132.53, 35.33],
    scale: 43000,
  },
  岡山県: {
    codePrefix: '33',
    center: [133.84, 34.83],
    scale: 77000,
  },
  広島県: {
    codePrefix: '34',
    center: [132.75, 34.58],
    scale: 62000,
  },
  山口県: {
    codePrefix: '35',
    center: [131.63, 34.26],
    scale: 51000,
  },
  徳島県: {
    codePrefix: '36',
    center: [134.24, 33.9],
    scale: 76000,
  },
  香川県: {
    codePrefix: '37',
    center: [133.98, 34.29],
    scale: 96000,
  },
  愛媛県: {
    codePrefix: '38',
    center: [132.86, 33.6],
    scale: 53000,
  },
  高知県: {
    codePrefix: '39',
    center: [133.39, 33.29],
    scale: 48000,
  },
  福岡県: {
    codePrefix: '40',
    center: [130.61, 33.62],
    scale: 70000,
  },
  佐賀県: {
    codePrefix: '41',
    center: [130.14, 33.29],
    scale: 110000,
  },
  長崎県: {
    codePrefix: '42',
    center: [129.36, 33.35],
    scale: 32000,
  },
  熊本県: {
    codePrefix: '43',
    center: [130.65, 32.65],
    scale: 65000,
  },
  大分県: {
    codePrefix: '44',
    center: [131.45, 33.23],
    scale: 70000,
  },
  宮崎県: {
    codePrefix: '45',
    center: [131.29, 32.1],
    scale: 60000,
  },
  鹿児島県: {
    codePrefix: '46',
    center: [129.8, 29.66],
    scale: 17000,
  },
  沖縄県: {
    codePrefix: '47',
    center: [127.13, 25.97],
    scale: 10000,
  },
}
