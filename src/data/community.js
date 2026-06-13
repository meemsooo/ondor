// 커뮤니티 더미 데이터
export const communityBoards = [
  { id: 'free', label: '자유게시판', emoji: '💬' },
  { id: 'info', label: '정보공유', emoji: '💡' },
  { id: 'notice', label: '공지사항', emoji: '📢' },
];

export const communityPosts = [
  {
    id: 'c1',
    boardId: 'notice',
    title: '[공지] 6월 기숙사 소방 점검 안내',
    content: '6월 10일 오전 10시부터 전 동 소방 점검이 진행됩니다. 협조 부탁드려요.',
    author: '관리사무소',
    likes: 12,
    comments: 3,
    createdAt: '1일 전',
    pinned: true,
  },
  {
    id: 'c2',
    boardId: 'free',
    title: '다들 시험기간 어떻게 버티세요?',
    content: '도서관 자리 잡기가 너무 힘드네요 ㅠㅠ 꿀팁 공유해요.',
    author: '복학생A',
    likes: 24,
    comments: 11,
    createdAt: '3시간 전',
    pinned: false,
  },
  {
    id: 'c3',
    boardId: 'info',
    title: '근처 24시간 무인 세탁소 위치 정리',
    content: '정문 앞이랑 후문 쪽에 하나씩 있어요. 가격이랑 운영시간 표로 정리했어요!',
    author: '자취왕',
    likes: 41,
    comments: 7,
    createdAt: '5시간 전',
    pinned: false,
  },
  {
    id: 'c4',
    boardId: 'free',
    title: '택배 잘못 온 거 같은데 어디다 문의하나요?',
    content: '제 앞으로 모르는 택배가 와서요. 혹시 아시는 분?',
    author: '새내기B',
    likes: 5,
    comments: 4,
    createdAt: '어제',
    pinned: false,
  },
];

export const noticeList = communityPosts.filter((p) => p.boardId === 'notice');
