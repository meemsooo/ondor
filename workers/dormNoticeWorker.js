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
 * HTML table 구조 기준:
 * <table>
 *   <tbody>
 *     <tr>
 *       <td>번호</td>
 *       <td><a href="...">제목</a></td>
 *       <td>글쓴이</td>
 *       <td>작성일</td>
 *       <td>조회수</td>
 *     </tr>
 *   </tbody>
 * </table>
 */
function parseNotices(html) {
  try {
    const notices = [];

    // 테이블 행 추출 (tr 태그)
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    let rowIndex = 0;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];
      
      // 헤더 행 제외 (th 태그 포함)
      if (rowContent.includes('<th')) continue;

      // 셀 데이터 추출
      const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const cells = [];
      let cellMatch;

      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        cells.push(cellMatch[1]);
      }

      // 최소 4개 셀이 있어야 함 (번호, 제목, 글쓴이, 작성일)
      if (cells.length < 4) continue;

      // 제목에서 링크 추출 (두 번째 셀)
      const titleCell = cells[1];
      const linkMatch = titleCell.match(/<a[^>]*href=["']([^"']*)[^>]*>([\s\S]*?)<\/a>/i);
      
      const title = linkMatch 
        ? stripHtml(linkMatch[2]).trim()
        : stripHtml(titleCell).trim();
      
      let link = linkMatch 
        ? linkMatch[1]
        : 'https://swudorm.suwon.ac.kr/index.html?menuno=2158';

      // 상대 경로를 절대 경로로 변환
      if (link.startsWith('/')) {
        link = 'https://swudorm.suwon.ac.kr' + link;
      } else if (!link.startsWith('http')) {
        link = 'https://swudorm.suwon.ac.kr/' + link;
      }

      // 글쓴이 (세 번째 셀)
      const author = stripHtml(cells[2]).trim();

      // 작성일 (네 번째 셀, YYYY-MM-DD 형식으로 정규화)
      const dateStr = stripHtml(cells[3]).trim();
      const date = normalizeDate(dateStr);

      // 조회수 (다섯 번째 셀, 선택사항)
      const views = cells.length > 4 ? stripHtml(cells[4]).trim() : '0';

      // 제목이 있는 경우만 추가
      if (title) {
        notices.push({
          id: `notice_${rowIndex}`,
          title,
          date,
          category: '공지',
          source: '수원대학교 기숙사',
          link,
          author,
          views: parseInt(views) || 0,
          crawledAt: new Date().toISOString(),
        });
        rowIndex++;
      }
    }

    return notices;
  } catch (error) {
    console.error('Parse error:', error);
    return [];
  }
}

/**
 * HTML 태그 제거
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * 날짜 형식 정규화 (YYYY-MM-DD)
 * 
 * 입력 형식:
 * - "2026-06-04"
 * - "2026.06.04"
 * - "06-04" (올해)
 * - "2026/06/04"
 */
function normalizeDate(dateStr) {
  // 이미 YYYY-MM-DD 형식인 경우
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // YYYY.MM.DD 형식
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(dateStr)) {
    return dateStr.replace(/\./g, '-');
  }

  // YYYY/MM/DD 형식
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
    return dateStr.replace(/\//g, '-');
  }

  // MM-DD 형식 (현재 연도로 가정)
  if (/^\d{2}-\d{2}$/.test(dateStr)) {
    const year = new Date().getFullYear();
    return `${year}-${dateStr}`;
  }

  // MM/DD 형식 (현재 연도로 가정)
  if (/^\d{2}\/\d{2}$/.test(dateStr)) {
    const year = new Date().getFullYear();
    const [month, day] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  // 파싱 실패시 현재 날짜 반환
  return new Date().toISOString().split('T')[0];
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
