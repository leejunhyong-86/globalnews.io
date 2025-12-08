# NewsDashvorld - 세계 뉴스 대시보드 작업 목록

## 현재 상태

### 완료된 작업 ✅
- [x] 프로젝트 초기 설정 (TypeScript, package.json)
- [x] Next.js 14 App Router 설정
- [x] Tailwind CSS 스타일링 설정
- [x] Notion API 클라이언트 구현
- [x] RSS 피드 파서 통합
- [x] 뉴스 수집 서비스 구현
- [x] Gemini AI 한 줄 요약 기능
- [x] Gemini AI 국가 추출 기능
- [x] Notion 데이터베이스 저장 로직 구현
- [x] 뉴스 API 엔드포인트 구현 (`/api/news`)
- [x] 3D 지구본 컴포넌트 (Three.js + react-three-fiber)
- [x] 2D 세계지도 컴포넌트 (D3.js)
- [x] 실시간 낮/밤 표현
- [x] 뉴스 마커 시각화
- [x] 호버/클릭 인터랙션
- [x] 2D/3D 뷰 토글 기능
- [x] 뉴스 상세 패널
- [x] 반응형 헤더 컴포넌트
- [x] 국가별 좌표 매핑 유틸리티

### 진행 중 🔄
- [ ] 의존성 설치 및 빌드 테스트
- [ ] 노션 DB '국가' 필드 추가 안내

### 대기 중 ⏳
- [ ] 배포 설정 (Vercel)
- [ ] GitHub Actions CI/CD

## 프로젝트 구조

```
NewsDashvorld/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 메인 대시보드 페이지
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── globals.css         # 글로벌 스타일
│   │   └── api/news/route.ts   # 뉴스 API 엔드포인트
│   ├── components/
│   │   ├── Globe3D.tsx         # 3D 지구본 컴포넌트
│   │   ├── WorldMap2D.tsx      # 2D 세계지도 컴포넌트
│   │   ├── NewsPanel.tsx       # 뉴스 상세 패널
│   │   ├── ViewToggle.tsx      # 2D/3D 토글 버튼
│   │   └── Header.tsx          # 헤더 컴포넌트
│   ├── types/
│   │   └── news.ts             # 타입 정의
│   ├── lib/
│   │   ├── notion-client.ts    # 노션 API 클라이언트
│   │   └── country-utils.ts    # 국가 좌표 유틸리티
│   ├── services/
│   │   ├── news-collector.ts   # 뉴스 수집 서비스
│   │   └── news-summarizer.ts  # AI 요약/국가 추출
│   ├── config/
│   │   ├── env.ts              # 환경 변수 설정
│   │   └── feeds.ts            # RSS 피드 설정
│   └── scripts/
│       └── news-collector.ts   # 뉴스 수집 스크립트
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── .env                        # 환경 변수 (git 제외)
```

## 핵심 기능

### 1. 세계지도 시각화
- **3D 지구본**: Three.js + react-three-fiber
  - 자동 회전 애니메이션
  - 마우스 드래그로 회전/줌
  - 별 배경 효과
  - 대기권 글로우 효과
  
- **2D 세계지도**: D3.js
  - Natural Earth 투영법
  - 위도/경도 격자선
  - 대륙 표시

### 2. 실시간 낮/밤 표현
- UTC 시간 기반 태양 위치 계산
- 계절에 따른 태양 적위 반영
- 낮 영역: 밝은 조명
- 밤 영역: 어두운 오버레이

### 3. 뉴스 마커
- 국가별 좌표에 뉴스 마커 표시
- 펄스 애니메이션 효과
- 호버 시 한 줄 요약 툴팁
- 클릭 시 상세 패널 오픈

### 4. AI 기능 (Gemini)
- 뉴스 한 줄 요약 (한국어)
- 뉴스 관련 국가 자동 추출
- 출처 기반 국가 추정 (백업)

## 환경 변수

```env
# Notion API
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

## 노션 데이터베이스 스키마

| 속성명 | 타입 | 설명 |
|--------|------|------|
| name | Title | 뉴스 제목 |
| URL | URL | 원문 링크 |
| 설명 | Rich Text | 기사 내용 요약 |
| 출처 | Rich Text | 뉴스 소스 (CNN, BBC 등) |
| date | Date | 기사 발행일 |
| 한 줄 요약 | Rich Text | AI 생성 한 줄 요약 |
| 국가 | Rich Text | 관련 국가 (NEW!) |

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 뉴스 수집 실행
pnpm news

# 프로덕션 빌드
pnpm build
pnpm start
```

## 다음 단계

### 단기 (1-2주)
- [ ] Vercel 배포
- [ ] PWA 설정 (모바일 홈화면 추가)
- [ ] 성능 최적화

### 중기 (1개월)
- [ ] 뉴스 필터링 (국가별, 날짜별)
- [ ] 검색 기능
- [ ] 다크/라이트 테마 토글
- [ ] 뉴스 알림 기능

### 장기 (3개월+)
- [ ] 안드로이드 위젯 앱 개발
- [ ] 텔레그램/슬랙 봇 연동
- [ ] 뉴스 트렌드 분석
- [ ] 다국어 지원
