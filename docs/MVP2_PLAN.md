# Chizu 2차 MVP 계획: 사용자 인증 및 클라우드 동기화

## 개요

비회원도 기존처럼 로컬에서 모든 기능을 사용할 수 있되, 회원 가입 시 데이터를 클라우드에 저장하여 기기 간 동기화 및 데이터 백업을 지원한다.

## 요구사항

### 기능 요구사항

| 구분 | 비회원 | 회원 |
|------|--------|------|
| 방문 기록 CRUD | ✅ (로컬) | ✅ (클라우드) |
| 지도 시각화 | ✅ | ✅ |
| 데이터 백업 | ❌ | ✅ |
| 기기 간 동기화 | ❌ | ✅ |
| 오프라인 사용 | ✅ | ✅ |

### 비기능 요구사항

- 기존 로컬 데이터 마이그레이션 (회원 가입 시 로컬 → 클라우드)
- 오프라인 작업 후 온라인 복귀 시 자동 동기화
- 충돌 해결 정책 (Last Write Wins 또는 사용자 선택)

---

## 기술 스택 옵션

### Option A: Supabase (추천)

```
인증: Supabase Auth (OAuth + 이메일)
DB: PostgreSQL (Supabase 호스팅)
실시간: Supabase Realtime
```

**장점**
- Auth + DB + Realtime 통합
- 무료 티어 (500MB DB, 50K MAU)
- PostgreSQL 기반으로 확장성 좋음
- Row Level Security로 보안 강화

**단점**
- 벤더 종속

### Option B: Firebase

```
인증: Firebase Auth
DB: Firestore (NoSQL)
```

**장점**
- Google 생태계 통합
- 오프라인 지원 내장
- 실시간 동기화

**단점**
- NoSQL이라 복잡한 쿼리 어려움
- 비용 예측 어려움

### Option C: 직접 구축

```
인증: NextAuth.js
DB: PostgreSQL (Vercel Postgres / PlanetScale)
API: Next.js API Routes
```

**장점**
- 완전한 제어권
- 벤더 종속 없음

**단점**
- 개발 시간 증가
- 인프라 관리 필요

---

## 추천 스택: Supabase

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  Next.js + Zustand + Dexie.js (오프라인 캐시)           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Supabase                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Auth        │  │ PostgreSQL  │  │ Realtime        │ │
│  │ - OAuth     │  │ - records   │  │ - 실시간 동기화  │ │
│  │ - 이메일    │  │ - users     │  │                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 데이터 모델

### users 테이블

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### records 테이블

```sql
CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- 기존 필드
  country TEXT NOT NULL DEFAULT 'korea',
  sido TEXT NOT NULL,
  sigungu TEXT NOT NULL,
  title TEXT NOT NULL,
  memo TEXT,
  address TEXT,
  visited_at DATE NOT NULL,
  visit_type TEXT,

  -- 동기화 관련
  local_id TEXT,  -- 로컬 IndexedDB ID (마이그레이션용)
  synced_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own records" ON records
  FOR ALL USING (auth.uid() = user_id);
```

---

## 인증 플로우

### 회원가입/로그인

```
1. 사용자가 "로그인" 클릭
2. OAuth 제공자 선택 (Google, 카카오, GitHub 등)
3. Supabase Auth로 인증
4. 로컬 데이터 존재 시 마이그레이션 프롬프트
   - "기존 N개의 기록을 클라우드에 저장하시겠습니까?"
5. 승인 시 로컬 → 클라우드 업로드
6. 이후 모든 CRUD는 클라우드 + 로컬 캐시
```

### 로그아웃

```
1. 로그아웃 시 로컬 캐시 유지 여부 선택
   - "이 기기에서 데이터를 유지하시겠습니까?"
2. 유지 선택 시: 로컬 데이터 유지 (오프라인 모드로 전환)
3. 삭제 선택 시: 로컬 데이터 삭제
```

---

## 동기화 전략

### 온라인 상태

```typescript
// 모든 CRUD 작업
1. Supabase에 즉시 반영
2. 로컬 IndexedDB에도 캐시 (오프라인 대비)
```

### 오프라인 상태

```typescript
// CRUD 작업
1. 로컬 IndexedDB에 저장
2. pending_sync 플래그 설정

// 온라인 복귀 시
1. pending_sync 레코드 조회
2. Supabase에 일괄 동기화
3. 충돌 시 Last Write Wins (updated_at 기준)
```

### 충돌 해결

```typescript
// 기본 정책: Last Write Wins
if (serverRecord.updated_at > localRecord.updated_at) {
  // 서버 데이터 우선
  updateLocal(serverRecord)
} else {
  // 로컬 데이터 우선
  updateServer(localRecord)
}

// 향후 고려: 사용자 선택 UI
```

---

## 구현 단계

### Phase 1: 기반 구축 (1주)

- [ ] Supabase 프로젝트 생성
- [ ] 테이블 스키마 설계 및 생성
- [ ] Row Level Security 설정
- [ ] `@supabase/supabase-js` 설치 및 클라이언트 설정

### Phase 2: 인증 구현 (1주)

- [ ] Supabase Auth 연동
- [ ] OAuth 제공자 설정 (Google, 카카오)
- [ ] 로그인/로그아웃 UI
- [ ] 인증 상태 전역 관리 (Zustand)

### Phase 3: 데이터 계층 리팩토링 (1주)

- [ ] 기존 Dexie.js 로직을 추상화 (Repository 패턴)
- [ ] Supabase 구현체 추가
- [ ] 비회원/회원 분기 처리
- [ ] 로컬 데이터 마이그레이션 로직

### Phase 4: 동기화 구현 (1주)

- [ ] 오프라인 감지 로직
- [ ] Pending sync 큐 관리
- [ ] 온라인 복귀 시 동기화
- [ ] 충돌 해결 로직

### Phase 5: UI/UX (0.5주)

- [ ] 로그인 버튼 (헤더/사이드메뉴)
- [ ] 동기화 상태 표시
- [ ] 마이그레이션 프롬프트
- [ ] 설정 페이지 (계정 관리)

### Phase 6: 테스트 및 배포 (0.5주)

- [ ] E2E 테스트
- [ ] 오프라인 시나리오 테스트
- [ ] 프로덕션 배포

---

## 파일 구조 (예상)

```
src/
├── lib/
│   └── supabase.ts           # Supabase 클라이언트
├── stores/
│   └── authStore.ts          # 인증 상태 관리
├── repositories/
│   ├── RecordRepository.ts   # 추상 인터페이스
│   ├── LocalRecordRepo.ts    # IndexedDB 구현
│   └── CloudRecordRepo.ts    # Supabase 구현
├── services/
│   ├── authService.ts        # 인증 로직
│   └── syncService.ts        # 동기화 로직
└── components/
    └── auth/
        ├── LoginButton.tsx
        ├── UserMenu.tsx
        └── MigrationModal.tsx
```

---

## 비용 예측 (Supabase 무료 티어)

| 항목 | 무료 한도 | 예상 사용량 |
|------|-----------|-------------|
| Database | 500MB | ~10MB (1만 유저 기준) |
| Auth MAU | 50,000 | 충분 |
| Storage | 1GB | 미사용 (이미지 없음) |
| Realtime | 200 동시접속 | 충분 |

**결론**: 초기에는 무료 티어로 충분

---

## 리스크 및 고려사항

1. **데이터 마이그레이션 실패**
   - 로컬 데이터 백업 후 진행
   - 실패 시 롤백 가능하도록

2. **오프라인 장기 사용 후 동기화**
   - 대량 데이터 동기화 시 타임아웃 주의
   - 청크 단위로 나눠서 동기화

3. **계정 삭제 시 데이터 처리**
   - GDPR 준수: 계정 삭제 시 모든 데이터 삭제
   - 삭제 전 데이터 내보내기 기능 제공

4. **다중 기기 동시 편집**
   - 현재 스코프에서는 Last Write Wins로 단순 처리
   - 향후 필요 시 CRDT 등 고려

---

## 참고 자료

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Offline-first with Supabase](https://supabase.com/blog/offline-first-react-native-apps)
