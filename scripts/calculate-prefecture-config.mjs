// 각 도도부현의 정확한 center와 scale 값을 계산하는 스크립트
import { readFileSync, writeFileSync } from 'fs'

const data = JSON.parse(readFileSync('public/data/geojson/japan/municipalities.json', 'utf8'))

// 도도부현 코드 목록
const prefectures = [
  { code: '01', name: '北海道' },
  { code: '02', name: '青森県' },
  { code: '03', name: '岩手県' },
  { code: '04', name: '宮城県' },
  { code: '05', name: '秋田県' },
  { code: '06', name: '山形県' },
  { code: '07', name: '福島県' },
  { code: '08', name: '茨城県' },
  { code: '09', name: '栃木県' },
  { code: '10', name: '群馬県' },
  { code: '11', name: '埼玉県' },
  { code: '12', name: '千葉県' },
  { code: '13', name: '東京都' },
  { code: '14', name: '神奈川県' },
  { code: '15', name: '新潟県' },
  { code: '16', name: '富山県' },
  { code: '17', name: '石川県' },
  { code: '18', name: '福井県' },
  { code: '19', name: '山梨県' },
  { code: '20', name: '長野県' },
  { code: '21', name: '岐阜県' },
  { code: '22', name: '静岡県' },
  { code: '23', name: '愛知県' },
  { code: '24', name: '三重県' },
  { code: '25', name: '滋賀県' },
  { code: '26', name: '京都府' },
  { code: '27', name: '大阪府' },
  { code: '28', name: '兵庫県' },
  { code: '29', name: '奈良県' },
  { code: '30', name: '和歌山県' },
  { code: '31', name: '鳥取県' },
  { code: '32', name: '島根県' },
  { code: '33', name: '岡山県' },
  { code: '34', name: '広島県' },
  { code: '35', name: '山口県' },
  { code: '36', name: '徳島県' },
  { code: '37', name: '香川県' },
  { code: '38', name: '愛媛県' },
  { code: '39', name: '高知県' },
  { code: '40', name: '福岡県' },
  { code: '41', name: '佐賀県' },
  { code: '42', name: '長崎県' },
  { code: '43', name: '熊本県' },
  { code: '44', name: '大分県' },
  { code: '45', name: '宮崎県' },
  { code: '46', name: '鹿児島県' },
  { code: '47', name: '沖縄県' },
]

function extractCoords(geometry) {
  const coords = []

  function recurse(arr) {
    if (Array.isArray(arr) && arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number') {
      coords.push(arr)
    } else if (Array.isArray(arr)) {
      arr.forEach(recurse)
    }
  }

  recurse(geometry.coordinates)
  return coords
}

function calculateBounds(features) {
  let minLon = Infinity, maxLon = -Infinity
  let minLat = Infinity, maxLat = -Infinity

  for (const feature of features) {
    const coords = extractCoords(feature.geometry)
    for (const [lon, lat] of coords) {
      if (lon < minLon) minLon = lon
      if (lon > maxLon) maxLon = lon
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
  }

  return { minLon, maxLon, minLat, maxLat }
}

const results = {}

for (const pref of prefectures) {
  const features = data.features.filter(f => {
    const code = f.properties?.N03_007
    return code && code.startsWith(pref.code)
  })

  if (features.length === 0) {
    console.log(`No features for ${pref.name} (${pref.code})`)
    continue
  }

  const bounds = calculateBounds(features)
  const centerLon = (bounds.minLon + bounds.maxLon) / 2
  const centerLat = (bounds.minLat + bounds.maxLat) / 2
  const lonRange = bounds.maxLon - bounds.minLon
  const latRange = bounds.maxLat - bounds.minLat
  const maxRange = Math.max(lonRange, latRange)

  // scale 계산: 더 큰 범위일수록 작은 scale 필요
  // 한국 sidoConfig 참고: 서울(0.4도 범위) -> scale 220000
  // 비례 계산: scale = 88000 / maxRange
  let scale = Math.round(88 / maxRange) * 1000

  // 범위 제한
  scale = Math.max(10000, Math.min(scale, 300000))

  results[pref.name] = {
    codePrefix: pref.code,
    center: [Math.round(centerLon * 100) / 100, Math.round(centerLat * 100) / 100],
    scale,
    // 디버깅용
    _bounds: bounds,
    _range: { lon: lonRange, lat: latRange, max: maxRange },
    _featureCount: features.length,
  }

  console.log(`${pref.name}: center=[${centerLon.toFixed(2)}, ${centerLat.toFixed(2)}], range=${maxRange.toFixed(2)}°, scale=${scale}`)
}

// 결과를 TypeScript 형식으로 출력
let tsOutput = `interface PrefectureConfig {
  codePrefix: string
  center: [number, number]
  scale: number
}

export const PREFECTURE_CONFIG: Record<string, PrefectureConfig> = {
`

for (const [name, config] of Object.entries(results)) {
  tsOutput += `  ${name}: {
    codePrefix: '${config.codePrefix}',
    center: [${config.center[0]}, ${config.center[1]}],
    scale: ${config.scale},
  },
`
}

tsOutput += `}
`

writeFileSync('src/components/map/prefectureConfig.generated.ts', tsOutput)
console.log('\nGenerated prefectureConfig.generated.ts')
