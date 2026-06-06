// 룸메 궁합 점수 계산 (설문 답 비교 기반)
import { surveyQuestions } from '../../data';

// 흡연 vs 비흡연이 만나면 적용하는 딜브레이커 감점 (문항 weight에 곱함)
const SMOKING_DEALBREAKER_PENALTY = 2;

const isSmokingConflict = (a, b) =>
  (a === 'smoker' && b === 'non_smoker') || (a === 'non_smoker' && b === 'smoker');

/**
 * 내 설문 답과 상대의 surveyAnswers를 비교해 0~100 궁합 점수를 반환.
 * - 문항 답이 같으면 그 문항 weight만큼 획득, 다르면 0점
 * - 흡연(smoking): 한 명 smoker / 다른 한 명 non_smoker면 딜브레이커로 큰 감점
 * - 최종 = round(획득 합 / 전체 weight 합 * 100), 0~100로 클램프
 */
export function calculateMatchScore(myAnswers = {}, theirAnswers = {}) {
  let earned = 0;
  let totalWeight = 0;

  for (const q of surveyQuestions) {
    totalWeight += q.weight;

    const mine = myAnswers[q.id];
    const theirs = theirAnswers[q.id];

    if (q.id === 'smoking' && isSmokingConflict(mine, theirs)) {
      // 딜브레이커: 일치 점수(0) 위에 추가 감점
      earned -= q.weight * SMOKING_DEALBREAKER_PENALTY;
      continue;
    }

    if (mine !== undefined && mine === theirs) {
      earned += q.weight;
    }
  }

  if (totalWeight === 0) return 0;

  const score = Math.round((earned / totalWeight) * 100);
  return Math.max(0, Math.min(100, score));
}

/**
 * 모든 프로필에 calculateMatchScore를 적용해 matchScore를 부여하고,
 * 점수 높은 순으로 정렬한 새 배열을 반환. (기존 matchRate는 보존)
 */
export function getMatchedProfiles(myAnswers = {}, profiles = []) {
  return profiles
    .map((profile) => ({
      ...profile,
      matchScore: calculateMatchScore(myAnswers, profile.surveyAnswers),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
