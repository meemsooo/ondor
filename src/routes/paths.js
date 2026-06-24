// 앱 전역 라우트 경로 상수
export const PATHS = {
  HOME: '/',

  // 도움요청
  HELP: '/help',
  HELP_NEW: '/help/new',
  HELP_DETAIL: '/help/:id',
  HELP_EDIT: '/help/:id/edit',

  // 공동구매
  GROUPBUY: '/group-buy',
  GROUPBUY_NEW: '/group-buy/new',
  GROUPBUY_DETAIL: '/group-buy/:id',
  GROUPBUY_EDIT: '/group-buy/:id/edit',

  // 물건 대여
  RENTAL: '/rental',
  RENTAL_NEW: '/rental/new',
  RENTAL_DETAIL: '/rental/:id',
  RENTAL_EDIT: '/rental/:id/edit',
  RENTAL_HISTORY: '/rental/history',

  // 룸메이트 매칭
  ROOMMATE: '/roommate',
  ROOMMATE_MATCHING: '/roommate/matching',

  // 커뮤니티
  COMMUNITY: '/community',
  COMMUNITY_NEW: '/community/new',
  COMMUNITY_DETAIL: '/community/:id',
  COMMUNITY_EDIT: '/community/:id/edit',

  // 기숙사 공지사항
  NOTICES: '/notices',
  NOTICES_DETAIL: '/notices/:id',

  // 채팅
  CHAT: '/chat',
  CHAT_ROOM: '/chat/:id',

  // 마이페이지
  MYPAGE: '/mypage',
};

// 동적 경로 헬퍼
export const to = {
  helpDetail: (id) => `/help/${id}`,
  helpEdit: (id) => `/help/${id}/edit`,
  groupBuyDetail: (id) => `/group-buy/${id}`,
  groupBuyEdit: (id) => `/group-buy/${id}/edit`,
  rentalDetail: (id) => `/rental/${id}`,
  rentalEdit: (id) => `/rental/${id}/edit`,
  communityDetail: (id) => `/community/${id}`,
  communityEdit: (id) => `/community/${id}/edit`,
  noticeDetail: (id) => `/notices/${id}`,
  chatRoom: (id) => `/chat/${id}`,
};
