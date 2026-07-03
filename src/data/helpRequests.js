// 도움 요청 더미 데이터
export const helpCategories = [
  { id: 'bug', label: '벌레 잡아주세요', emoji: '🐛' },
  { id: 'move', label: '무거운 짐 옮기기', emoji: '📦' },
  { id: 'etc', label: '기타 도움', emoji: '🙋' },
];

// 매칭 상태: 'waiting'(대기중) | 'matched'(매칭됨) | 'done'(완료)
export const helpRequests = [];

export const helpStatusMeta = {
  waiting: { label: '대기중', tone: 'warning' },
  matched: { label: '매칭됨', tone: 'info' },
  done: { label: '완료', tone: 'success' },
};
