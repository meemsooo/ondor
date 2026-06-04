// 도움 요청 더미 데이터
export const helpCategories = [
  { id: 'bug', label: '벌레 잡아주세요', emoji: '🐛' },
  { id: 'move', label: '무거운 짐 옮기기', emoji: '📦' },
  { id: 'etc', label: '기타 도움', emoji: '🙋' },
];

// 매칭 상태: 'waiting'(대기중) | 'matched'(매칭됨) | 'done'(완료)
export const helpRequests = [
  {
    id: 'h1',
    categoryId: 'bug',
    title: '방에 바퀴벌레가 나왔어요 ㅠㅠ',
    content: '혼자서는 도저히 못 잡겠어요. 도와주실 분 계신가요? 음료수 사드릴게요!',
    author: '새내기B',
    location: '3동 302호',
    reward: '음료수 한 잔',
    status: 'waiting',
    createdAt: '5분 전',
    applicants: 0,
  },
  {
    id: 'h2',
    categoryId: 'move',
    title: '택배 박스 같이 옮겨주실 분',
    content: '생수 2박스가 너무 무거워요. 1층 택배함에서 4층까지만 도와주세요.',
    author: '복학생A',
    location: '2동 1층',
    reward: '5,000원',
    status: 'matched',
    matchedWith: '자취왕',
    createdAt: '22분 전',
    applicants: 2,
  },
  {
    id: 'h3',
    categoryId: 'etc',
    title: '드라이버 잠깐 빌려주실 분',
    content: '책상 조립하는데 십자드라이버가 필요해요. 10분이면 됩니다!',
    author: '야행성코더',
    location: '1동 508호',
    reward: '커피 기프티콘',
    status: 'done',
    createdAt: '2시간 전',
    applicants: 3,
  },
  {
    id: 'h4',
    categoryId: 'bug',
    title: '날벌레 너무 많아요',
    content: '창문 열었더니 날벌레가... 살충제 있으신 분 도와주세요.',
    author: '깔끔러',
    location: '햇살원룸 201호',
    reward: '아이스크림',
    status: 'waiting',
    createdAt: '1시간 전',
    applicants: 1,
  },
];

export const helpStatusMeta = {
  waiting: { label: '대기중', tone: 'warning' },
  matched: { label: '매칭됨', tone: 'info' },
  done: { label: '완료', tone: 'success' },
};
