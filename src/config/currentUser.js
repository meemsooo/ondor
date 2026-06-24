// 임시 현재 사용자 정보
// 로그인 기능이 아직 없으므로 한 곳에서 관리한다.
// 추후 로그인 / 인증 service 로 교체할 수 있도록 이 파일만 바꾸면 되도록 분리했다.
export const currentUser = {
  id: 'current-user',
  name: '온돌이',
  dormitory: '행복기숙사 3동',

  // ----- 기존 디자인(마이페이지/홈)과의 호환용 필드 -----
  nickname: '온돌이',
  dorm: '행복기숙사 3동',
  room: '302호',
  avatar: '🧑',
  ondolScore: 86,
  temperature: '따뜻해요',
};

/**
 * 현재 사용자 조회 (추후 인증 연동 시 이 함수만 교체)
 */
export function getCurrentUser() {
  return currentUser;
}
