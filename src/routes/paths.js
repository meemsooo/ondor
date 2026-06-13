// 앱 전역 라우트 경로 상수
export const PATHS = {
  HOME: '/',

  HELP: '/help',
  HELP_WRITE: '/help/write',
  HELP_MATCHING: '/help/:id/matching',

  GROUPBUY: '/group-buy',
  GROUPBUY_DETAIL: '/group-buy/:id',

  RENTAL: '/rental',
  RENTAL_REGISTER: '/rental/register',
  RENTAL_HISTORY: '/rental/history',

  ROOMMATE: '/roommate',
  ROOMMATE_SURVEY: '/roommate/survey',
  ROOMMATE_MATCHING: '/roommate/matching',

  POKE_SEND: '/poke',
  POKE_RECEIVED: '/poke/received',

  COMMUNITY: '/community',

  CHAT: '/chat',
  CHAT_ROOM: '/chat/:id',

  MYPAGE: '/mypage',
};

// 동적 경로 헬퍼
export const to = {
  helpMatching: (id) => `/help/${id}/matching`,
  groupBuyDetail: (id) => `/group-buy/${id}`,
  chatRoom: (id) => `/chat/${id}`,
};
