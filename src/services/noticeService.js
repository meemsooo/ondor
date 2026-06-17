import { dormNotices } from '../data/notices';

/**
 * 기숙사 공지사항 조회
 * 현재는 더미 데이터 반환, 나중에 Cloudflare Worker API로 교체 가능
 * 
 * TODO: Replace with Cloudflare Worker API
 * const API_URL = 'https://your-worker.yourname.workers.dev/dorm-notices';
 */
export async function fetchDormNotices() {
  try {
    // 더미 데이터 반환 (실제 환경에서는 API 호출로 교체)
    return dormNotices;
    
    // 실제 API 호출 예시 (미래):
    // const response = await fetch(API_URL);
    // if (!response.ok) throw new Error('Failed to fetch notices');
    // return await response.json();
  } catch (error) {
    console.error('Failed to fetch dorm notices:', error);
    // 에러 발생 시 더미 데이터 반환 (fallback)
    return dormNotices;
  }
}

/**
 * 최신 공지사항 1개 조회
 */
export async function getLatestDormNotice() {
  const notices = await fetchDormNotices();
  return notices.length > 0 ? notices[0] : null;
}
