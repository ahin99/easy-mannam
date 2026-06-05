# 모일날

친구들과 가능한 날짜를 모아 최적의 모임 날짜를 찾는 웹앱입니다.

## 주요 기능

- 모임 생성
- 참여 링크 및 참여 코드 생성
- 로그인 없는 이름 기반 참여
- 날짜 범위 안에서 가능한 날짜 선택
- 같은 이름으로 재제출 시 기존 투표 수정
- 최적 날짜 3순위 표시
- 미투표 인원 수 표시

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Postgres
- zod
- date-fns
- lucide-react

## 로컬 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3001`로 접속합니다.

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. Supabase SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
3. `.env.local`에 환경변수를 입력합니다.

```text
SUPABASE_URL=your-supabase-project-url
SUPABASE_SECRET_KEY=your-supabase-secret-or-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

`SUPABASE_SECRET_KEY`는 서버에서만 사용합니다. 공개 저장소에 `.env.local`을 커밋하지 마세요.

## Vercel 배포

1. 이 폴더를 GitHub public repository로 올립니다.
2. Vercel에서 해당 repository를 import합니다.
3. Project Settings의 Environment Variables에 아래 값을 등록합니다.

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
NEXT_PUBLIC_APP_URL
```

`NEXT_PUBLIC_APP_URL`은 배포된 Vercel URL로 설정합니다.

## 프로젝트 구조

```text
app/
  page.tsx
  create/page.tsx
  join/page.tsx
  m/[code]/page.tsx
  m/[code]/results/page.tsx
  api/meetings/
components/
lib/
supabase/schema.sql
```

## 참고

이 앱은 MVP 기준으로 같은 모임 안에서 같은 이름을 같은 참여자로 취급합니다. 같은 이름으로 다시 제출하면 이전 선택 날짜가 새 선택 날짜로 교체됩니다.
