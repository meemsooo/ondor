/**
 * Cloudflare Worker — 기숙사 공지사항 크롤러 (개선 버전)
 * 
 * 기능:
 * 1. 목록 페이지 파싱 (번호, 제목, 글쓴이, 작성일, 조회수, 상세 링크)
 * 2. 각 공지별 상세 페이지 파싱 (제목, 글쓴이, 등록일, 조회수, 본문)
 * 3. JSON 형식으로 변환하여 반환
 * 
 * 엔드포인트:
 * - GET /dorm-notices → 공지사항 목록 (상세 링크 포함)
 * - GET /dorm-notices/:id → 특정 공지사항 상세 정보
 * 
 * CORS 헤더 포함, 캐시 10분 적용
 */

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // CORS 프리플라이트 요청 처리
  if (request.method === 'OPTIONS') {
    return corsResponse(null);
  }

  try {
    // 목록 API
    if (path === '/dorm-notices' || path === '/dorm-notices/') {
      const notices = await fetchAndParseNoticesList();
      return corsResponse(JSON.stringify(notices), 200);
    }

    // 상세 API
    const detailMatch = path.match(/\/dorm-notices\/(.+)/);
    if (detailMatch) {
      const noticeId = detailMatch[1];
      const detail = await fetchAndParseNoticeDetail(noticeId);
      return corsResponse(JSON.stringify(detail), 200);
    }

    // 루트 경로
    return corsResponse(JSON.stringify({ message: 'Dorm Notice Worker API' }), 200);
  } catch (error) {
    console.error('Worker error:', error);
    return corsResponse(
      JSON.stringify({
        error: 'Failed to fetch dorm notices',
        message: error.message,
      }),
      500
    );
  }
}

/**
 * CORS 헤더를 포함한 응답 생성
 */
function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=600', // 10분 캐시
      'X-Crawled-At': new Date().toISOString(),
    },
  });
}

/**
 * 목록 페이지 fetch 및 파싱
 */
async function fetchAndParseNoticesList() {
  const dormNoticeUrl = 'https://swudorm.suwon.ac.kr/index.html?menuno=2158';

  const response = await fetch(dormNoticeUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const html = await response.text();
  const notices = parseNoticesList(html);

  return notices;
}

/**
 * 목록 페이지 HTML에서 공지사항 파싱
 * 
 * 표 구조:
 * - 번호 (number)
 * - 제목 (title) + 링크 (href)
 * - 글쓴이 (author)
 * - 작성일 (date)
 * - 조회수 (views)
 */
function parseNoticesList(html) {
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

      // 최소 4개 셀이 있어야 함
      if (cells.length < 4) continue;

      // 각 셀 파싱
      const number = stripHtml(cells[0]).trim();
      const titleCell = cells[1];
      const author = stripHtml(cells[2]).trim();
      const dateStr = stripHtml(cells[3]).trim();
      const views = cells.length > 4 ? stripHtml(cells[4]).trim() : '0';

      // 제목에서 링크 추출
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

      // 날짜 정규화
      const date = normalizeDate(dateStr);

      // 유효한 공지만 추가
      if (title && number) {
        notices.push({
          id: number, // 번호를 ID로 사용
          number,
          title,
          date,
          category: '공지',
          source: '수원대학교 기숙사',
          author: author || '기숙사',
          views: parseInt(views) || 0,
          link, // 상세 페이지 링크
          crawledAt: new Date().toISOString(),
        });
        rowIndex++;
      }
    }

    return notices;
  } catch (error) {
    console.error('List parsing error:', error);
    return [];
  }
}

/**
 * 특정 공지사항 상세 정보 fetch 및 파싱
 */
async function fetchAndParseNoticeDetail(noticeId) {
  // 상세 페이지 URL 구성 (숫자 기반)
  // 실제 URL 구조는 사이트에 따라 다를 수 있음
  const detailUrl = `https://swudorm.suwon.ac.kr/index.html?menuno=2158&no=${noticeId}`;

  try {
    const response = await fetch(detailUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch detail: ${response.status}`);
    }

    const html = await response.text();
    const detail = parseNoticeDetail(html, noticeId);

    return detail;
  } catch (error) {
    console.error('Detail fetch error:', error);
    // 상세 페이지 fetch 실패 시 기본 정보만 반환
    return {
      id: noticeId,
      content: '공지사항 상세 정보를 불러올 수 없습니다. 수원대학교 기숙사 홈페이지에서 확인해주세요.',
    };
  }
}

/**
 * 상세 페이지 HTML에서 정보 파싱
 * 
 * 추출 항목:
 * - 제목
 * - 글쓴이
 * - 등록일
 * - 조회수
 * - 본문 내용
 */
function parseNoticeDetail(html, noticeId) {
  try {
    let title = '';
    let author = '';
    let date = '';
    let views = '';
    let content = '';

    // 제목 추출 (일반적인 h1, h2, .title, .subject 등)
    let titleMatch = html.match(/<h[1-2][^>]*>([^<]+)<\/h[1-2]>/i);
    if (titleMatch) {
      title = stripHtml(titleMatch[1]).trim();
    }

    // 본문 추출 (일반적인 .content, .body, .article-content 등)
    let contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (!contentMatch) {
      contentMatch = html.match(/<div[^>]*class="[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) {
      contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    }

    if (contentMatch) {
      content = stripHtmlKeepText(contentMatch[1]).trim();
    }

    // 메타 정보 추출 (테이블)
    const metaMatch = html.match(
      /<table[^>]*>([\s\S]*?)<\/table>/i
    );
    if (metaMatch) {
      const tableContent = metaMatch[1];

      // 글쓴이
      const authorMatch = tableContent.match(
        /<td[^>]*>작성자|글쓴이<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
      );
      if (authorMatch) {
        author = stripHtml(authorMatch[1]).trim();
      }

      // 작성일
      const dateMatch = tableContent.match(
        /<td[^>]*>작성일|등록일|작성 일시<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
      );
      if (dateMatch) {
        date = stripHtml(dateMatch[1]).trim();
      }

      // 조회수
      const viewsMatch = tableContent.match(
        /<td[^>]*>조회수|조회|views<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
      );
      if (viewsMatch) {
        views = stripHtml(viewsMatch[1]).trim();
      }
    }

    return {
      id: noticeId,
      title: title || '제목 없음',
      author,
      date,
      views: parseInt(views) || 0,
      content: content || '본문 내용을 불러올 수 없습니다.',
      crawledAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Detail parsing error:', error);
    return {
      id: noticeId,
      content: '공지사항 상세 정보를 불러올 수 없습니다.',
    };
  }
}

/**
 * HTML 태그 제거
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * HTML 태그 제거 (텍스트 유지, 줄바꿈 유지)
 */
function stripHtmlKeepText(html) {
  return html
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .join('\n');
}

/**
 * 날짜 형식 정규화 (YYYY-MM-DD)
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
