# Next.js Boilerplate

Next.js 16 + TypeScript + styled-components 보일러플레이트

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 16 (Pages Router) |
| Language | TypeScript 5.9 |
| Runtime | Node.js 25.2.1 |
| Styling | styled-components 6 |
| Linting | ESLint 9 (Flat Config), typescript-eslint |
| Formatting | Prettier |
| Git Hooks | Husky, Commitlint |
| Package Manager | pnpm 10.28.0 (필수) |

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
├── .husky/              # Git Hooks 설정
│   ├── pre-commit       # 커밋 전 lint 실행
│   └── commit-msg       # 커밋 메시지 검증
├── pages/               # 페이지 라우팅
│   ├── _app.tsx         # 앱 진입점 (테마, 글로벌 스타일)
│   ├── _document.tsx    # HTML 문서 (SSR 설정)
│   └── index.tsx        # 메인 페이지
├── public/              # 정적 파일 (이미지, 폰트 등)
├── styles/              # 스타일 설정
│   ├── global-styles.ts # 글로벌 스타일
│   ├── styled.d.ts      # 테마 타입 정의
│   └── theme.ts         # 테마 설정
├── .env.example         # 환경변수 템플릿
├── .nvmrc               # Node 버전
├── eslint.config.mjs    # ESLint 9 설정
├── commitlint.config.js # 커밋 메시지 규칙
└── package.json
```

## 테마 사용

```typescript
import styled from 'styled-components';

const Box = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.md};
`;
```

### 테마 속성

```typescript
// colors
theme.colors.primary     // #007bff
theme.colors.secondary   // #6c757d
theme.colors.background  // #ffffff
theme.colors.text        // #212529
theme.colors.border      // #dee2e6

// spacing
theme.spacing.xs  // 4px
theme.spacing.sm  // 8px
theme.spacing.md  // 16px
theme.spacing.lg  // 24px
theme.spacing.xl  // 32px
```

## 커밋 규칙

`type(scope): 설명` 형식 필수

```bash
# 예시
feat(auth): 로그인 기능 추가
fix(api): 응답 파싱 오류 수정
docs(readme): 설치 가이드 추가
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
