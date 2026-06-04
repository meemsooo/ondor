// 물건 대여 더미 데이터
// type: 'offer'(빌려드려요) | 'request'(빌려주세요)
export const rentals = [
  {
    id: 'r1',
    type: 'offer',
    title: '무선 청소기 빌려드려요',
    emoji: '🧹',
    fee: '무료',
    owner: '깔끔러',
    location: '햇살원룸',
    status: 'available',
    createdAt: '10분 전',
  },
  {
    id: 'r2',
    type: 'request',
    title: '캐리어 28인치 빌려주세요',
    emoji: '🧳',
    fee: '하루 2,000원',
    owner: '복학생A',
    location: '행복기숙사 2동',
    status: 'available',
    createdAt: '30분 전',
  },
  {
    id: 'r3',
    type: 'offer',
    title: '전기장판 대여 가능해요',
    emoji: '🔌',
    fee: '주 5,000원',
    owner: '자취왕',
    location: '그린오피스텔',
    status: 'rented',
    createdAt: '1시간 전',
  },
  {
    id: 'r4',
    type: 'offer',
    title: '공구세트(드릴 포함)',
    emoji: '🛠️',
    fee: '무료',
    owner: '야행성코더',
    location: '행복기숙사 1동',
    status: 'available',
    createdAt: '3시간 전',
  },
];

// 내 대여 내역
export const rentalHistory = [
  { id: 'rh1', title: '무선 청소기', counterpart: '깔끔러', role: '빌림', period: '6/1 ~ 6/2', status: '반납완료' },
  { id: 'rh2', title: '캐리어 28인치', counterpart: '새내기B', role: '빌려줌', period: '6/4 ~ 6/6', status: '대여중' },
];

export const rentalTypeMeta = {
  offer: { label: '빌려드려요', tone: 'primary' },
  request: { label: '빌려주세요', tone: 'info' },
};
