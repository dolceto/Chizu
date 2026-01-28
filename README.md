# Chizu (地図)

한국/일본 지도 기반 방문 기록 다이어리

## 개요

Chizu는 한국과 일본 지도를 행정구역 단위로 탐색하며 방문 기록을 남길 수 있는 웹 애플리케이션입니다. 방문 유형에 따른 히트맵 시각화와 오프라인 저장을 지원합니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 한국 지도 | 시/도 → 시/군/구 드릴다운 |
| 일본 지도 | 도도부현 → 시구정촌 드릴다운 |
| 섬 네비게이션 | 도쿄, 오키나와 등 도서 지역 시점 이동 |
| 히트맵 | 방문 유형 점수에 따른 지역별 색상 |
| 확대/축소/패닝 | 마우스 휠 및 드래그로 지도 조작 |
| 방문 유형 | 거주/여행/경유 등 6가지 유형 및 점수 시스템 |
| 기록 관리 | 방문 기록 CRUD |
| 로컬 저장 | IndexedDB 기반 오프라인 데이터 저장 |

## 방문 유형 점수

| 유형 | 점수 | 설명 |
|------|------|------|
| 거주 | 5 | 해당 지역에 거주 |
| 숙박 여행 | 4 | 숙박을 포함한 여행 |
| 당일치기 | 3 | 당일 방문 |
| 경유/환승 | 2 | 잠시 경유 |
| 방문 예정 | 1 | 방문 계획 |
| 미방문 | 0 | 방문한 적 없음 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (Pages Router) |
| Language | TypeScript |
| Map | react-simple-maps, D3-geo, D3-zoom |
| State | Zustand (persist) |
| Local DB | Dexie.js (IndexedDB) |
| Styling | styled-components |
| UI | Radix UI |
| Linting | ESLint, Prettier |
| Git Hooks | Husky, Commitlint |
| Package Manager | pnpm |

## 시작하기

```bash
# Node 버전 확인 (nvm 사용 시)
nvm use

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

http://localhost:3000 에서 확인

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm start` | 프로덕션 서버 실행 |
| `pnpm lint` | 린트 검사 |
| `pnpm lint:fix` | 린트 자동 수정 |
| `pnpm format` | Prettier 포맷팅 |

## 디렉토리 구조

```
src/
├── components/
│   ├── map/
│   │   ├── KoreaMap.tsx          # 한국 시/도 지도
│   │   ├── RegionMap.tsx         # 한국 시/군/구 지도
│   │   ├── JapanMap.tsx          # 일본 도도부현 지도
│   │   ├── JapanRegionMap.tsx    # 일본 시구정촌 지도
│   │   ├── MainMap.tsx           # 메인 지도 (국가 전환)
│   │   ├── MapNavigation.tsx     # 뒤로가기/브레드크럼
│   │   ├── MapTooltip.tsx        # 호버 툴팁
│   │   ├── ZoomControls.tsx      # 확대/축소 버튼
│   │   ├── prefectureConfig.ts   # 도도부현 설정 (섬 포함)
│   │   └── japaneseToKorean.ts   # 일본 지명 한글 변환
│   ├── ui/
│   │   ├── RecordModal.tsx       # 기록 모달
│   │   ├── RecordForm.tsx        # 기록 입력 폼
│   │   ├── RecordList.tsx        # 기록 목록
│   │   ├── SideMenu.tsx          # 사이드 메뉴
│   │   └── Toast.tsx             # 토스트 알림
│   └── common/
│       └── ChizuLogo.tsx         # 로고
├── stores/
│   ├── useRecordStore.ts         # 기록 상태 관리
│   └── useMapStore.ts            # 지도 상태 관리 (persist)
├── db/
│   ├── index.ts                  # Dexie 설정
│   └── records.ts                # 기록 CRUD
├── types/
│   ├── record.ts                 # 기록/방문유형 타입
│   └── map.ts                    # 지도 타입
└── data/geojson/
    ├── korea/                    # 한국 GeoJSON
    └── japan/                    # 일본 GeoJSON
```

## 로드맵

### 1차 MVP ✅

- [x] 한국 지도 (시/도 → 시/군/구)
- [x] 일본 지도 (도도부현 → 시구정촌)
- [x] 섬 네비게이션 (도쿄, 오키나와 등)
- [x] 확대/축소/패닝
- [x] 히트맵 시각화
- [x] 방문 유형 점수 시스템
- [x] 기록 CRUD
- [x] 로컬 저장 (IndexedDB)
- [x] 다크/라이트 테마

### 2차 MVP 🚧

- [ ] 소셜 로그인 (Google, 카카오)
- [ ] 클라우드 동기화 (Supabase)
- [ ] 기기 간 데이터 동기화
- [ ] 오프라인 → 온라인 자동 동기화

> 상세 계획: [docs/MVP2_PLAN.md](./docs/MVP2_PLAN.md)

### 향후 계획

- [ ] 다른 국가 지도 확장 (대만, 중국 등)
- [ ] 통계 대시보드
- [ ] 데이터 내보내기/가져오기

## 커밋 규칙

`type(scope): 설명` 형식 필수

```bash
feat(map): 일본 도도부현 지도 추가
fix(modal): 모달 닫힘 버그 수정
perf(map): 시구정촌 렌더링 최적화
```

| Type | 설명 |
|------|------|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| perf | 성능 개선 |
| docs | 문서 수정 |
| style | 코드 스타일 변경 |
| refactor | 리팩토링 |
| test | 테스트 추가 |
| chore | 빌드, 설정 변경 |

## 라이선스

MIT
