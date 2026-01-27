# Chizu (地図)

지역별 방문 기록을 시각화하는 인터랙티브 지도 다이어리

## 개요

Chizu는 한국 지도를 시/도, 시/군/구 단위로 탐색하며 방문 기록을 남길 수 있는 웹 애플리케이션입니다. 방문 횟수에 따른 히트맵 시각화와 특정 장소 핀 마커 기능을 제공합니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| 한국 지도 | 시/도 17개 경계선 표시 및 클릭 인터랙션 |
| 시/군/구 상세 | 시/도 클릭 시 하위 행정구역 드릴다운 |
| 히트맵 | 기록 수에 따른 지역별 색상 구분 |
| 핀 마커 | 좌표 기반 특정 장소 표시 |
| 확대/축소/패닝 | 마우스 휠 및 드래그로 지도 조작 |
| 반응형 모달 | 지역/핀 클릭 시 상세 정보 표시 |
| 기록 관리 | 방문 기록 생성/조회/수정/삭제 |
| 로컬 저장 | IndexedDB 기반 오프라인 데이터 저장 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js (Pages Router) |
| Language | TypeScript |
| Map | react-simple-maps, D3-geo |
| State | Zustand |
| Local DB | Dexie.js (IndexedDB) |
| Styling | styled-components |
| UI Components | Radix UI |
| Linting | ESLint, Prettier |
| Git Hooks | Husky, Commitlint |
| Package Manager | pnpm |

## 시작하기

```bash
# Node 버전 확인 (nvm 사용 시)
nvm use

# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env.local

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
│   │   ├── korea/              # 한국 지도 컴포넌트
│   │   │   ├── KoreaMap.tsx    # 전국 시/도 지도
│   │   │   ├── RegionMap.tsx   # 시/군/구 상세 지도
│   │   │   ├── MapPath.tsx     # 개별 지역 SVG path
│   │   │   ├── PinMarker.tsx   # 장소 핀 마커
│   │   │   ├── MapTooltip.tsx  # 호버 툴팁
│   │   │   └── index.ts
│   │   ├── common/             # 공통 지도 컴포넌트
│   │   │   ├── MapContainer.tsx
│   │   │   ├── ZoomControls.tsx
│   │   │   └── MapLegend.tsx
│   │   └── index.ts
│   ├── modal/
│   │   ├── RecordModal.tsx     # 기록 상세 모달
│   │   ├── RecordForm.tsx      # 기록 입력 폼
│   │   └── RecordList.tsx      # 기록 목록
│   └── ui/                     # 공통 UI 컴포넌트
├── stores/
│   ├── useRecordStore.ts       # 기록 상태 관리
│   └── useMapStore.ts          # 지도 상태 관리
├── db/
│   ├── index.ts                # Dexie 설정
│   └── records.ts              # 기록 CRUD
├── data/
│   └── geojson/
│       └── korea/
│           ├── sido.json       # 시/도 경계 데이터
│           └── sigungu/        # 시/군/구 경계 데이터
│               ├── seoul.json
│               ├── busan.json
│               └── ...
├── types/
│   ├── record.ts               # 기록 타입 정의
│   └── map.ts                  # 지도 타입 정의
└── pages/
    └── index.tsx               # 메인 페이지
```

## 데이터 구조

### Record (기록)

```typescript
interface Record {
  id: string

  // 위치 정보
  sido: string           // "서울특별시"
  sigungu: string        // "강남구"
  address?: string       // 상세 주소
  coordinates?: {        // 핀 마커용 좌표
    lat: number
    lng: number
  }

  // 기록 내용
  title: string
  memo?: string
  category?: string      // "카페" | "맛집" | "여행" 등
  photos?: string[]

  // 시간
  visitedAt: string      // 방문 날짜
  createdAt: string
  updatedAt: string
}
```

### 히트맵 색상 등급

| 방문 횟수 | 색상 |
|----------|------|
| 0회 | 회색 |
| 1-5회 | 연한 파랑 |
| 6-20회 | 초록 |
| 21-50회 | 노랑 |
| 51-100회 | 주황 |
| 100회+ | 빨강 |

## 로드맵

### 1차 MVP
- [x] 프로젝트 설정
- [ ] 한국 지도 렌더링 (시/도)
- [ ] 시/군/구 드릴다운
- [ ] 확대/축소/패닝
- [ ] 히트맵 시각화
- [ ] 핀 마커
- [ ] 기록 CRUD
- [ ] 반응형 모달
- [ ] 로컬 저장 (IndexedDB)

### 2차
- [ ] 소셜 로그인
- [ ] 서버/DB 연동
- [ ] 사용자별 데이터 분리
- [ ] 다른 국가 지도 확장

## 커밋 규칙

`type(scope): 설명` 형식 필수

```bash
# 예시
feat(map): 한국 지도 컴포넌트 추가
fix(modal): 모달 닫힘 버그 수정
docs(readme): 기능 설명 추가
```

| Type | 설명 |
|------|------|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| style | 코드 스타일 변경 |
| refactor | 리팩토링 |
| test | 테스트 추가 |
| chore | 빌드, 설정 변경 |

## 라이선스

MIT
