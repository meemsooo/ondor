import { PATHS } from '../routes/paths';

// 하단 탭 네비게이션 (메인 5개 탭)
export const bottomNavItems = [
  { id: 'home', label: '홈', icon: '🏠', path: PATHS.HOME },
  { id: 'help', label: '도움요청', icon: '🙋', path: PATHS.HELP },
  { id: 'poke', label: '콕 찌르기', icon: '👉', path: PATHS.POKE_SEND },
  { id: 'community', label: '커뮤니티', icon: '💬', path: PATHS.COMMUNITY },
  { id: 'mypage', label: '마이', icon: '👤', path: PATHS.MYPAGE },
];

// 홈 화면 카테고리 바로가기 그리드
export const homeShortcuts = [
  { id: 'help', label: '도움요청', emoji: '🙋', path: PATHS.HELP, color: '#fff0e3' },
  { id: 'groupbuy', label: '공동구매', emoji: '🛒', path: PATHS.GROUPBUY, color: '#e6f7f0' },
  { id: 'rental', label: '물건대여', emoji: '📦', path: PATHS.RENTAL, color: '#ecf3ff' },
  { id: 'roommate', label: '룸메이트', emoji: '🛏️', path: PATHS.ROOMMATE, color: '#fff5e0' },
  { id: 'community', label: '커뮤니티', emoji: '💬', path: PATHS.COMMUNITY, color: '#ffecec' },
  { id: 'chat', label: '채팅', emoji: '✉️', path: PATHS.CHAT, color: '#f0eeec' },
  { id: 'poke', label: '콕 찌르기', emoji: '👉', path: PATHS.POKE_SEND, color: '#fff0e3' },
];
