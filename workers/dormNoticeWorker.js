/**
 * Cloudflare Worker — 기숙사 공지사항 크롤러
 * 
 * 용도:
 * - 수원대학교 기숙사 홈페이지에서 공지사항을 주기적으로 크롤링
 * - JSON 형식으로 변환하여 반환
 * - 프론트엔드는 이 API를 호출하여 데이터 표시
 * 
 * 배포:
 * 1. Cloudflare 계정 생성 (https://dash.cloudflare.com/)
 * 2. Workers & Pages > Create > Create Worker
 * 3. 이 코드를 붙여넣고 배포
 * 4. 생성된 URL을 noticeService.js의 API_URL로 설정
 * 
 * 보안:
 * - 공개 공지사항만 수집 (로그인 불필요)
 * - 개인정보 미수집
 * - CORS 헤더 포함
 * - 캐시 10분 적용 (서버 부하 감소)
 */

// Cloudflare Worker 핸들러
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // CORS 프리플라이트 요청 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
      },
    });
  }

  try {
    // 기숙사 공지사항 페이지 접근
    const dormNoticeUrl = 'https://swudorm.suwon.ac.kr/index.html?menuno=2158';

    const response = await fetch(dormNoticeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // HTML 파싱하여 공지사항 추출
    // 주의: 사이트 구조 변경 시 이 부분을 수정해야 함
    const notices = parseNotices(html);

    // JSON 응답 생성
    return new Response(JSON.stringify(notices), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=600', // 10분 캐시
        'X-Crawled-At': new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Dorm notice worker error:', error);

    // 에러 응답
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch dorm notices',
        message: error.message,
        notices: [],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

/**
 * HTML에서 공지사항 추출
 * 
 * 주의: 이 함수는 사이트 구조에 따라 커스터마이징 필요
 * 
 * 기숙사 홈페이지의 HTML 구조를 분석하여 작성
 * 예: 테이블, 리스트 등 상황에 맞게 수정
 */
function parseNotices(html) {
  try {
    // 더미 파싱 예시 (실제로는 사이트의 HTML 구조 분석 필요)
    // 일반적인 웹사이트 구조:
    // 1. 테이블 행 추출: document.querySelectorAll('tr')
    // 2. 각 행에서 제목, 날짜, 링크 추출
    // 3. JSON 배열로 변환

    const notices = [];

    // 예시: 정규식을 사용한 간단한 파싱
    // 실제로는 더 정교한 HTML 파싱 라이브러리 사용 권장
    // (예: cheerio, htmlparser2 등 - Cloudflare Workers와 호환 필요)

    // 매우 기본적인 예시:
    // const titleRegex = /<a[^>]*href=["']([^"']*)[^>]*>([^<]*)<\/a>/g;
    // let match;
    // while ((match = titleRegex.exec(html)) !== null) {
    //   notices.push({
    //     title: match[2].trim(),
    //     link: match[1],
    //     date: extractDate(html, match.index),
    //   });
    // }

    // 실제 구현을 위해서는 사이트의 HTML 구조를 상세히 분석하고
    // 적절한 선택자 또는 정규식을 작성해야 함

    return notices;
  } catch (error) {
    console.error('Parse error:', error);
    return [];
  }
}

/**
 * HTML에서 날짜 추출 (예시)
 */
function extractDate(html, index) {
  // 주어진 index 근처에서 날짜 정보 추출
  // 형식: YYYY-MM-DD
  const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
  const match = html.substring(Math.max(0, index - 100), index + 100).match(dateRegex);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : new Date().toISOString().split('T')[0];
}

/**
 * 사용 예시:
 * 
 * 프론트엔드에서:
 * const response = await fetch('https://your-worker.yourname.workers.dev/dorm-notices');
 * const notices = await response.json();
 * 
 * 배포 후 이 URL을 src/services/noticeService.js의 API_URL로 설정하면 됨
 */

/**
 * Cloudflare Workers 문서:
 * https://developers.cloudflare.com/workers/get-started/guide/
 * 
 * 주의사항:
 * 1. 외부 사이트 크롤링은 이용약관 확인 필요
 * 2. robots.txt 준수
 * 3. User-Agent 설정으로 봇 식별
 * 4. 너무 빈번한 요청으로 대상 서버 부하 주지 않기
 * 5. 캐싱 적극 활용
 */
