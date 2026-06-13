# 🔥 온돌 (OnDol)

대학 기숙사 및 고밀도 주거 공간(원룸·오피스텔)에서 생활 속 문제를 해결하고 이웃을 연결하는 **생활 플랫폼** — MVP 뼈대.

> 따뜻한 연주황(`#FF8A3D`) 컬러 · 당근마켓 + 토스 + 오늘의집 감성 · 모바일 앱 기준 UI

현재 단계는 **화면 구조 & 앱 아키텍처 구축**이 목적입니다. 실제 서버 / 결제 / Firebase / API 연결 없이
모두 **더미 데이터** 기반으로 동작합니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # 린트
```

## 기술 스택

- React 19 + Vite
- react-router-dom v7 (라우팅)
- 순수 CSS + 디자인 토큰(CSS 변수) 기반 디자인 시스템

## 폴더 구조

```
src/
├─ components/
│  ├─ common/         # 공통 UI 컴포넌트 (디자인 시스템)
│  │   Button, Card, Badge, Avatar, Header,
│  │   SectionHeader, SegmentedTabs, EmptyState, FAB
│  └─ layout/         # AppLayout, BottomNavigation
├─ config/
│  └─ navigation.js   # 하단 탭 / 홈 바로가기 설정
├─ data/              # 더미 데이터 (도메인별)
│   users, helpRequests, groupBuys, rentals,
│   roommates, community, chats
├─ pages/             # 화면 (기능별 폴더)
│   home/ help/ groupbuy/ rental/
│   roommate/ community/ chat/ mypage/
├─ routes/
│  ├─ paths.js        # 라우트 경로 상수
│  └─ AppRoutes.jsx   # 라우팅 정의
├─ styles/
│  ├─ tokens.css      # 디자인 토큰 (색상/간격/타이포 등)
│  ├─ global.css      # 글로벌 리셋 & 베이스
│  └─ form.css        # 공통 폼 스타일
├─ App.jsx            # BrowserRouter
└─ main.jsx           # 엔트리
```

## 화면 구성 (8개 영역)

| 영역 | 경로 | 화면 |
|------|------|------|
| 🏠 홈 | `/` | 최근 도움요청·공동구매, 인기글, 공지, 프로필 바로가기 |
| 🙋 도움요청 | `/help` | 목록 / 작성(`/help/write`) / 매칭 상태(`/help/:id/matching`) |
| 🛒 공동구매 | `/group-buy` | 모집중·진행중·완료 / 상세(`/group-buy/:id`) |
| 📦 물건대여 | `/rental` | 빌려주세요·빌려드려요 / 등록 / 대여내역 |
| 🛏️ 룸메이트 | `/roommate` | 프로필 카드(생활패턴·수면·청결·공부) / 매칭 |
| 💬 커뮤니티 | `/community` | 자유게시판 / 정보공유 / 공지사항 |
| ✉️ 채팅 | `/chat` | 채팅 목록 / 채팅방(`/chat/:id`) |
| 👤 마이페이지 | `/mypage` | 프로필 / 온돌지수 / 활동내역 / 설정 |

하단 네비게이션은 **홈 · 도움요청 · 공동구매 · 커뮤니티 · 마이** 5개 탭이며,
물건대여 / 룸메이트 / 채팅은 홈 바로가기와 헤더 채팅 아이콘으로 진입합니다.

## 디자인 시스템

모든 색상·간격·타이포·그림자는 `src/styles/tokens.css`의 CSS 변수로 관리됩니다.
공통 컴포넌트(`src/components/common`)를 조합해 화면을 구성하며, 새 화면도 동일 토큰/컴포넌트를 재사용하면 됩니다.

## 다음 단계 (TODO)

- [ ] 더미 데이터 → 상태관리(Context/Zustand) 또는 API 연동
- [ ] 글 작성 / 등록 폼 실제 저장 로직
- [ ] 인증 / 로그인
- [ ] 실시간 채팅 (현재 로컬 상태)
- [ ] 결제 (공동구매 정산)
