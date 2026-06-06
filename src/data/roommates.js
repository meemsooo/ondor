// 룸메이트 매칭 더미 데이터 (프로필 카드)
export const roommateProfiles = [
  {
    id: 'rm1',
    nickname: '민지',
    avatar: '🐰',
    age: 22,
    major: '디자인학과',
    intro: '조용하고 깔끔한 룸메이트 찾아요. 주말엔 본가 가요!',
    lifestyle: {
      sleep: '23시 ~ 07시', // 수면 시간
      cleanliness: '매우 깔끔', // 청결 성향
      study: '집에서 공부', // 공부 스타일
      smoking: '비흡연',
    },
    matchRate: 92,
    tags: ['아침형', '비흡연', '깔끔'],
    surveyAnswers: {
      sleep: 'early',
      cleanliness: 'very_clean',
      smoking: 'non_smoker',
      noise: 'quiet',
      sharing: 'partial',
      social: 'moderate',
    },
  },
  {
    id: 'rm2',
    nickname: '서준',
    avatar: '🦉',
    age: 24,
    major: '컴퓨터공학과',
    intro: '야행성이라 새벽까지 코딩해요. 서로 방해 안 하는 룸메 원해요.',
    lifestyle: {
      sleep: '02시 ~ 10시',
      cleanliness: '보통',
      study: '카페/도서관',
      smoking: '비흡연',
    },
    matchRate: 74,
    tags: ['야행성', '조용함', '독립적'],
    surveyAnswers: {
      sleep: 'late',
      cleanliness: 'clean',
      smoking: 'non_smoker',
      noise: 'quiet',
      sharing: 'separate',
      social: 'independent',
    },
  },
  {
    id: 'rm3',
    nickname: '하늘',
    avatar: '🐻',
    age: 21,
    major: '경영학과',
    intro: '같이 밥도 먹고 친하게 지낼 룸메 구해요 :) 외향적입니다!',
    lifestyle: {
      sleep: '24시 ~ 08시',
      cleanliness: '깔끔',
      study: '도서관',
      smoking: '비흡연',
    },
    matchRate: 88,
    tags: ['외향적', '아침형', '활발'],
    surveyAnswers: {
      sleep: 'normal',
      cleanliness: 'clean',
      smoking: 'non_smoker',
      noise: 'tolerant',
      sharing: 'open',
      social: 'close',
    },
  },
];

// 생활 패턴 항목 정의 (등록/필터용)
export const lifestyleFields = [
  { key: 'sleep', label: '수면 시간', emoji: '😴' },
  { key: 'cleanliness', label: '청결 성향', emoji: '🧼' },
  { key: 'study', label: '공부 스타일', emoji: '📚' },
  { key: 'smoking', label: '흡연 여부', emoji: '🚭' },
];
