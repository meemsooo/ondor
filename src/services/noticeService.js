import { dormNotices } from '../data/notices';

/**
 * 기숙사 공지사항 조회
 * 
 * Cloudflare Worker API:
 * GET https://your-worker.yourname.workers.dev/dorm-notices
 * 응답: { success: true, data: [...notices with content] }
 * 
 * 현재는 fallback으로 더미 데이터 사용
 */
export async function fetchDormNotices() {
  try {
    // TODO: Cloudflare Worker URL로 교체
    // const API_URL = 'https://your-worker.yourname.workers.dev/dorm-notices';
    // const response = await fetch(API_URL);
    // if (!response.ok) throw new Error('Failed to fetch notices');
    // const result = await response.json();
    // if (result.success && result.data) {
    //   return result.data;
    // }
    // throw new Error('Invalid API response');

    // Fallback: 더미 데이터 반환
    return dormNotices;
  } catch (error) {
    console.error('Failed to fetch dorm notices:', error);
    // 에러 발생 시 더미 데이터 반환
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

/**
 * 공지사항 상세 정보 조회
 * 
 * Worker API를 사용할 때는 목록 요청에서 이미 content가 포함됨
 * 따라서 이 함수는 fallback 데이터를 반환하거나
 * 이미 로드된 데이터에서 찾는 용도
 * 
 * @param {string|number} id - 공지사항 ID (bbsno)
 * @returns {Promise<Object>} 공지사항 상세 정보
 */
export async function fetchNoticeDetail(id) {
  try {
    // fallback: 더미 데이터에서 조회
    const notice = dormNotices.find((n) => n.id === String(id));
    
    if (!notice) {
      throw new Error(`Notice not found: ${id}`);
    }

    // TODO: Worker API를 사용할 때:
    // const API_URL = `https://your-worker.yourname.workers.dev/dorm-notices/${id}`;
    // const response = await fetch(API_URL);
    // if (!response.ok) throw new Error('Failed to fetch notice detail');
    // const result = await response.json();
    // return result.data || result;

    return notice;
  } catch (error) {
    console.error('Failed to fetch notice detail:', error);
    throw error;
  }
}
