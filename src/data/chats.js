// 채팅 더미 데이터
export const chatRooms = [
  {
    id: 'chat1',
    partner: '자취왕',
    avatar: '🐰',
    context: '생수 2L 공동구매',
    lastMessage: '네 그럼 오늘 저녁 7시에 1층에서 봬요!',
    unread: 2,
    updatedAt: '오후 3:12',
  },
  {
    id: 'chat2',
    partner: '깔끔러',
    avatar: '🐻',
    context: '무선 청소기 대여',
    lastMessage: '청소기 잘 쓰고 반납했습니다 감사해요 :)',
    unread: 0,
    updatedAt: '오후 1:40',
  },
  {
    id: 'chat3',
    partner: '복학생A',
    avatar: '🐱',
    context: '도움요청 · 택배 옮기기',
    lastMessage: '혹시 지금 시간 괜찮으세요?',
    unread: 1,
    updatedAt: '오전 11:05',
  },
];

// 채팅방 메시지 더미 (방별)
export const chatMessages = {
  chat1: [
    { id: 'm1', sender: 'partner', text: '안녕하세요! 생수 공구 같이 하실래요?', time: '오후 2:50' },
    { id: 'm2', sender: 'me', text: '네 좋아요! 몇 분 더 모으면 되나요?', time: '오후 2:55' },
    { id: 'm3', sender: 'partner', text: '한 분만 더 모으면 돼요 :)', time: '오후 3:00' },
    { id: 'm4', sender: 'partner', text: '네 그럼 오늘 저녁 7시에 1층에서 봬요!', time: '오후 3:12' },
  ],
  chat2: [
    { id: 'm1', sender: 'me', text: '청소기 빌려주셔서 감사했어요!', time: '오후 1:30' },
    { id: 'm2', sender: 'partner', text: '청소기 잘 쓰고 반납했습니다 감사해요 :)', time: '오후 1:40' },
  ],
  chat3: [
    { id: 'm1', sender: 'partner', text: '혹시 지금 시간 괜찮으세요?', time: '오전 11:05' },
  ],
};
