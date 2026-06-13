// 룸메 생활 성향 설문 문항
// weight: 매칭 점수 가중치 (값이 클수록 갈등 위험이 큰 딜브레이커)
//  - smoking, noise: 3 (딜브레이커)
//  - cleanliness, sharing: 2
//  - sleep, social: 1
// id는 roommates.js의 lifestyle 키와 연결됨 (sleep/cleanliness/smoking은 기존 키 재사용)
export const surveyQuestions = [
  {
    id: 'sleep',
    category: '수면',
    weight: 1,
    question: '평소 몇 시에 잠드는 편인가요?',
    options: [
      { label: '일찍 자요 (~23시)', value: 'early' },
      { label: '보통이에요 (24~01시)', value: 'normal' },
      { label: '늦게 자요 (02시 이후)', value: 'late' },
    ],
  },
  {
    id: 'cleanliness',
    category: '청결',
    weight: 2,
    question: '방 청결은 어느 정도로 유지하나요?',
    options: [
      { label: '매우 깔끔하게', value: 'very_clean' },
      { label: '적당히 깔끔', value: 'clean' },
      { label: '크게 신경 안 써요', value: 'relaxed' },
    ],
  },
  {
    id: 'smoking',
    category: '흡연',
    weight: 3,
    question: '흡연을 하나요?',
    options: [
      { label: '비흡연', value: 'non_smoker' },
      { label: '실외에서만', value: 'outdoor_only' },
      { label: '흡연', value: 'smoker' },
    ],
  },
  {
    id: 'noise',
    category: '소음',
    weight: 3,
    question: '방에서 소음(통화/음악 등)에 얼마나 민감한가요?',
    options: [
      { label: '조용한 게 좋아요', value: 'quiet' },
      { label: '보통이에요', value: 'normal' },
      { label: '시끌벅적해도 괜찮아요', value: 'tolerant' },
    ],
  },
  {
    id: 'sharing',
    category: '물건공유',
    weight: 2,
    question: '생활용품 공유는 어떻게 생각하나요?',
    options: [
      { label: '같이 쓰면 좋아요', value: 'open' },
      { label: '필요한 것만 공유', value: 'partial' },
      { label: '각자 쓰는 게 편해요', value: 'separate' },
    ],
  },
  {
    id: 'social',
    category: '관계',
    weight: 1,
    question: '룸메이트와 어떤 관계를 원하나요?',
    options: [
      { label: '친하게 지내고 싶어요', value: 'close' },
      { label: '적당한 거리감', value: 'moderate' },
      { label: '서로 독립적으로', value: 'independent' },
    ],
  },
];
