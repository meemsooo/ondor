// 익명 '콕 찌르기' 더미 데이터
// 기숙사/공용공간 생활 마찰을 익명으로 정중히 알리는 기능

// 찌르기 카테고리 정의
export const pokeCategories = [
  {
    id: 'noise',
    label: '소음',
    emoji: '🔊',
    message: '늦은 시간 소음에 대해 정중히 알려드려요.',
  },
  {
    id: 'smoking',
    label: '복도 흡연',
    emoji: '🚬',
    message: '복도 흡연 냄새가 들어와요. 흡연 구역 이용을 부탁드려요.',
  },
  {
    id: 'trash',
    label: '쓰레기',
    emoji: '🗑️',
    message: '공용공간 쓰레기 정리를 부탁드려요.',
  },
  {
    id: 'space',
    label: '공용공간',
    emoji: '🧹',
    message: '공용공간 사용 후 정리에 함께 신경 써주시면 좋겠어요.',
  },
];

// 받은 찌르기 알림 더미 (보낸 사람 정보 없음 — 익명)
export const receivedPokes = [
  { id: 'pk1', category: 'noise', createdAt: '10분 전', isRead: false },
  { id: 'pk2', category: 'trash', createdAt: '2시간 전', isRead: false },
  { id: 'pk3', category: 'smoking', createdAt: '어제', isRead: true },
  { id: 'pk4', category: 'space', createdAt: '3일 전', isRead: true },
];
