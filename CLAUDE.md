# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Chizu(地図)는 한국 지도 기반 방문 기록 다이어리 웹앱입니다. 시/도, 시/군/구 단위 드릴다운, 히트맵 시각화, 핀 마커, 오프라인 저장을 지원합니다.

## 개발 환경

```bash
nvm use                 # Node v25.2.1
pnpm install            # 의존성 설치 (pnpm 필수)
pnpm dev                # 개발 서버 (localhost:3000)
```

## 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm lint` | ESLint 검사 (--max-warnings 0) |
| `pnpm lint:fix` | 린트 자동 수정 |
| `pnpm format` | Prettier 포맷팅 |

## 기술 스택

- **Framework**: Next.js 16 (Pages Router)
- **State**: Zustand
- **Map**: react-simple-maps + D3-geo
- **Local DB**: Dexie.js (IndexedDB)
- **Styling**: styled-components (light/dark 테마)
- **UI**: Radix UI

## 아키텍처

```
pages/              # Next.js Pages Router
src/
├── types/          # 타입 정의 (Record, MapState, GeoJSON 등)
├── stores/         # Zustand 스토어
├── db/             # Dexie IndexedDB 설정
├── components/     # React 컴포넌트
└── data/geojson/   # 한국 지도 GeoJSON 데이터
styles/             # styled-components 테마, 글로벌 스타일
```

**경로 별칭**: `@/*` → 프로젝트 루트 (예: `@/src/types`)

## 커밋 규칙

**Conventional Commits + scope 필수**

```bash
# 형식
type(scope): 설명

# 예시
feat(map): 시/도 지도 컴포넌트 추가
fix(modal): 닫힘 버그 수정
```

| Type | 설명 |
|------|------|
| feat | 새 기능 |
| fix | 버그 수정 |
| docs | 문서 |
| style | 코드 스타일 |
| refactor | 리팩토링 |
| test | 테스트 |
| chore | 설정/빌드 |

## Git Hooks (Husky)

- **pre-commit**: `pnpm lint` 실행
- **commit-msg**: commitlint로 메시지 검증

## 핵심 타입

```typescript
// Record - 방문 기록
interface Record {
  id: string
  sido: string           // "서울특별시"
  sigungu: string        // "강남구"
  title: string
  visitedAt: string
  // ...
}

// MapState - 지도 상태
interface MapState {
  currentLevel: 'country' | 'sido'
  selectedSido?: string
  zoom: number
  center: [number, number]
  // ...
}
```

## 지도 렌더링 패턴

### MultiPolygon 처리
MultiPolygon 타입의 시구정촌(예: 히로시마 아키구)은 각 폴리곤을 개별적으로 처리하여 path를 생성하고 합치는 방식을 사용한다.

1. 본토 중심에서 2도 이내의 폴리곤만 포함 (멀리 떨어진 도서 지역 제외)
2. 각 폴리곤을 개별적으로 d3-geo path 생성
3. 각 폴리곤에 대해 클리핑 사각형 제거 로직 적용
4. 모든 path를 공백으로 연결하여 하나의 d 속성으로 합침

> 참고: `src/components/map/JapanRegionMap.tsx`의 `processedFeatures` useMemo

## 히트맵 색상

| 방문 횟수 | 색상 |
|----------|------|
| 0 | 회색 (#E5E7EB) |
| 1-5 | 연파랑 (#BFDBFE) |
| 6-20 | 초록 (#86EFAC) |
| 21-50 | 노랑 (#FDE047) |
| 51-100 | 주황 (#FB923C) |
| 100+ | 빨강 (#F87171) |

## 다중 터미널 작업 규칙 (필수)

### 워크스페이스 파일
- **위치**: `docs/WORKSPACE.md`
- **목적**: 여러 터미널 간 작업 조율 및 충돌 방지

### 터미널 식별
세션 시작 시 사용자에게 터미널 번호를 확인받습니다:
```
"몇 번 터미널에서 작업하시나요? (1, 2, 3)"
```

### 작업 프로토콜

#### 1. 작업 시작 전
1. `docs/WORKSPACE.md` 읽기
2. 자신의 터미널 섹션에 현재 작업 기록
3. 다른 터미널 작업과 충돌 여부 확인

#### 2. 작업 중
- **자신의 섹션만 수정** (다른 터미널 섹션은 읽기 전용)
- 작업 로그에 진행 상황 기록

#### 3. 작업 완료 후
1. 자신의 터미널 섹션 - 작업 로그 업데이트
2. "공유 정보" 섹션 - TODO 체크박스 업데이트
3. "완료된 작업 히스토리" 테이블에 기록 추가

### 섹션 수정 규칙

| 섹션 | Terminal 1 | Terminal 2 | Terminal 3 |
|------|------------|------------|------------|
| Terminal 1 영역 | 수정 가능 | 읽기 전용 | 읽기 전용 |
| Terminal 2 영역 | 읽기 전용 | 수정 가능 | 읽기 전용 |
| Terminal 3 영역 | 읽기 전용 | 읽기 전용 | 수정 가능 |
| 공유 정보 | 수정 가능 | 수정 가능 | 수정 가능 |
| 완료 히스토리 | 추가만 | 추가만 | 추가만 |

### 충돌 방지
- 같은 파일을 동시에 수정하지 않도록 작업 전 WORKSPACE.md 확인
- 작업 대상 파일이 겹치면 먼저 시작한 터미널이 우선
