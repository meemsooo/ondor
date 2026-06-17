/**
 * Cloudflare Worker — 수원대학교 기숙사 공지사항 크롤러 (POST 기반)
 * 
 * 기능:
 * 1. 목록 페이지 파싱 (displayNo, bbsno, title, writer, date, views)
 * 2. 각 공지별 상세 페이지 POST 요청 (bbsno 기반)
 * 3. 상세 페이지 HTML 파싱 (제목, 글쓴이, 등록일, 조회수, 본문)
 * 4. 최신 10개 공지 반환
 * 
 * 엔드포인트:
 * - GET /dorm-notices → 공지사항 목록 + 상세 내용
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
    // 목록 API (모든 공지 + 상세 내용 포함)
    if (path === '/dorm-notices' || path === '/dorm-notices/') {
      const notices = await fetchAndParseNoticesList();
      return corsResponse(JSON.stringify({ success: true, data: notices }), 200);
    }

    // 상세 API (특정 공지)
    const detailMatch = path.match(/\/dorm-notices\/(.+)/);
    if (detailMatch) {
      const noticeId = detailMatch[1];
      const notice = await fetchAndParseNoticeDetail(noticeId);
      return corsResponse(JSON.stringify({ success: true, data: notice }), 200);
    }

    // 루트 경로
    return corsResponse(JSON.stringify({ message: 'Dorm Notice Worker API' }), 200);
  } catch (error) {
    console.error('Worker error:', error);
    return corsResponse(
      JSON.stringify({
        success: false,
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=600', // 10분 캐시
      'X-Crawled-At': new Date().toISOString(),
    },
  });
}

/**
 * 목록 페이지 fetch 및 파싱
 * 1. 목록 HTML을 fetch
 * 2. 각 공지의 displayNo, bbsno, title, writer, date, views 추출
 * 3. 각 공지마다 POST로 상세 페이지 fetch
 * 4. 상세 내용 파싱
 * 5. 최신 10개만 반환
 */
async function fetchAndParseNoticesList() {
  const dormNoticeUrl = 'https://swudorm.suwon.ac.kr/index.html?menuno=2158';

  try {
    // 1. 목록 페이지 fetch
    const response = await fetch(dormNoticeUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch list page: ${response.status}`);
    }

    const html = await response.text();

    // 2. 목록 HTML 파싱
    const listNotices = parseNoticesList(html);
    
    // 목록이 비어있으면 에러
    if (!listNotices || listNotices.length === 0) {
      throw new Error('No notices found in list');
    }

    // 3. 각 공지의 상세 내용 fetch (최대 10개)
    const detailedNotices = [];
    const limitedNotices = listNotices.slice(0, 10);

    for (const notice of limitedNotices) {
      try {
        // POST 요청으로 상세 페이지 fetch
        const detailHtml = await fetchNoticeDetailHtml(notice);
        
        // 상세 HTML 파싱
        const detailInfo = parseNoticeDetail(detailHtml, notice);
        
        // 목록 정보 + 상세 정보 병합
        detailedNotices.push({
          id: notice.bbsno, // ID는 bbsno 사용
          displayNo: notice.displayNo, // 화면에 보이는 번호
          bbsno: notice.bbsno, // 실제 상세요청 번호
          title: notice.title,
          writer: notice.writer || '기숙사',
          date: notice.date,
          views: notice.views,
          category: '공지',
          source: '수원대학교 기숙사',
          content: detailInfo.content || '',
          detailRequest: {
            method: 'POST',
            url: dormNoticeUrl,
            bbsno: notice.bbsno,
            boardno: notice.boardno || '997',
            siteno: notice.siteno || '29',
          },
          crawledAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error(`Failed to fetch detail for notice ${notice.bbsno}:`, error);
        // 상세 fetch 실패해도 목록 정보는 포함
        detailedNotices.push({
          id: notice.bbsno,
          displayNo: notice.displayNo,
          bbsno: notice.bbsno,
          title: notice.title,
          writer: notice.writer || '기숙사',
          date: notice.date,
          views: notice.views,
          category: '공지',
          source: '수원대학교 기숙사',
          content: '상세 내용을 불러올 수 없습니다. 학교 원문에서 확인해주세요.',
          detailRequest: {
            method: 'POST',
            url: dormNoticeUrl,
            bbsno: notice.bbsno,
            boardno: notice.boardno || '997',
            siteno: notice.siteno || '29',
          },
          crawledAt: new Date().toISOString(),
        });
      }
    }

    return detailedNotices;
  } catch (error) {
    console.error('List parsing error:', error);
    return [];
  }
}

/**
 * 목록 페이지 HTML에서 공지사항 파싱
 * 
 * 추출 정보:
 * - displayNo: 화면에 보이는 번호
 * - bbsno: 실제 상세요청에 사용할 번호
 * - title: 공지 제목
 * - writer: 글쓴이
 * - date: 작성일
 * - views: 조회수
 * - boardno, siteno: POST 요청에 사용할 정보
 * 
 * bbsno 추출 방법:
 * 1. 제목 a 태그의 onclick="goView(291)" 형태에서 숫자 추출
 * 2. data-bbsno="291" 속성에서 추출
 * 3. href에서 javascript 함수 호출 파싱
 */
function parseNoticesList(html) {
  try {
    const notices = [];

    // 페이지 전체에서 boardno, siteno, ztag 추출 (공통 값)
    const boardnoMatch = html.match(/boardno\s*=\s*["']?(\d+)/i);
    const sitenoMatch = html.match(/siteno\s*=\s*["']?(\d+)/i);
    const ztagMatch = html.match(/ztag\s*=\s*["']?([^"'\s&]+)/i);

    const defaultBoardno = boardnoMatch ? boardnoMatch[1] : '997';
    const defaultSiteno = sitenoMatch ? sitenoMatch[1] : '29';
    const defaultZtag = ztagMatch ? ztagMatch[1] : '';

    // 테이블 행 추출
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1];
      
      // 헤더 행 제외
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

      try {
        // 각 셀 파싱
        const displayNo = stripHtml(cells[0]).trim();
        const titleCell = cells[1];
        const writer = stripHtml(cells[2]).trim();
        const dateStr = stripHtml(cells[3]).trim();
        const views = cells.length > 4 ? stripHtml(cells[4]).trim() : '0';

        // 제목에서 링크 및 bbsno 추출
        const titleResult = extractTitleAndBbsno(titleCell);
        const title = titleResult.title;
        let bbsno = titleResult.bbsno;

        // bbsno가 없으면 displayNo를 사용 (fallback)
        if (!bbsno) {
          bbsno = displayNo;
        }

        // 날짜 정규화
        const date = normalizeDate(dateStr);

        // 유효한 공지만 추가 (displayNo와 title 필수)
        if (title && displayNo) {
          notices.push({
            displayNo,
            bbsno,
            title,
            date,
            writer: writer || '기숙사',
            views: parseInt(views) || 0,
            boardno: defaultBoardno,
            siteno: defaultSiteno,
            ztag: defaultZtag,
          });
        }
      } catch (error) {
        console.error('Cell parsing error:', error);
        continue;
      }
    }

    return notices;
  } catch (error) {
    console.error('List parsing error:', error);
    return [];
  }
}

/**
 * 제목 셀에서 제목과 bbsno 추출
 * 
 * 가능한 형식:
 * 1. <a href="#" onclick="goView(291, 'view')">제목</a>
 * 2. <a href="#" data-bbsno="291" onclick="...">제목</a>
 * 3. <a href="javascript:viewDetail(291)">제목</a>
 * 4. <a href="#" data-bbsno="291">제목</a>
 */
function extractTitleAndBbsno(titleCell) {
  const result = {
    title: stripHtml(titleCell).trim(),
    bbsno: null,
  };

  // 방법 1: onclick 속성에서 숫자 추출 (첫 번째 숫자)
  const onclickMatch = titleCell.match(/onclick\s*=\s*["']([^"']*(?:goView|view|goDetail|detail)\s*\(\s*(\d+)[^)]*\))/i);
  if (onclickMatch && onclickMatch[2]) {
    result.bbsno = onclickMatch[2];
    return result;
  }

  // 방법 2: data-bbsno 속성
  const dataBbsnoMatch = titleCell.match(/data-bbsno\s*=\s*["'](\d+)["']/i);
  if (dataBbsnoMatch && dataBbsnoMatch[1]) {
    result.bbsno = dataBbsnoMatch[1];
    return result;
  }

  // 방법 3: href="javascript:..." 형태
  const hrefJsMatch = titleCell.match(/href\s*=\s*["']javascript:([^"']+)/i);
  if (hrefJsMatch) {
    const jsCode = hrefJsMatch[1];
    // javascript: 코드에서 숫자 추출
    const numMatch = jsCode.match(/\((\d+)/);
    if (numMatch && numMatch[1]) {
      result.bbsno = numMatch[1];
      return result;
    }
  }

  // 방법 4: a 태그의 모든 속성에서 숫자 찾기
  const aTagMatch = titleCell.match(/<a[^>]*>/i);
  if (aTagMatch) {
    const aTag = aTagMatch[0];
    // 모든 속성값에서 큰 숫자 찾기 (bbsno는 보통 2-3자리)
    const numberMatches = aTag.match(/[=\(\s](\d{2,})/g);
    if (numberMatches && numberMatches.length > 0) {
      // 마지막 매치가 가장 가능성 높음
      const lastMatch = numberMatches[numberMatches.length - 1];
      const numMatch = lastMatch.match(/(\d+)/);
      if (numMatch) {
        result.bbsno = numMatch[1];
      }
    }
  }

  return result;
}

/**
 * 상세 페이지 HTML fetch
 * POST 요청으로 상세 페이지를 가져옴
 */
async function fetchNoticeDetailHtml(notice) {
  const dormNoticeUrl = 'https://swudorm.suwon.ac.kr/index.html?menuno=2158';

  // POST body 구성
  const bodyParams = new URLSearchParams();
  bodyParams.append('key', '');
  bodyParams.append('bbstitle', '');
  bodyParams.append('keyword', '');
  bodyParams.append('ztag', notice.ztag || '');
  bodyParams.append('siteno', notice.siteno || '29');
  bodyParams.append('page', '1');
  bodyParams.append('boardno', notice.boardno || '997');
  bodyParams.append('act', 'view');
  bodyParams.append('bbspasswd', '');
  bodyParams.append('bbsno', notice.bbsno);

  const response = await fetch(dormNoticeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': dormNoticeUrl,
      'Origin': 'https://swudorm.suwon.ac.kr',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    body: bodyParams.toString(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch detail page: ${response.status}`);
  }

  return await response.text();
}

/**
 * 상세 페이지 HTML에서 정보 파싱
 */
function parseNoticeDetail(html, notice) {
  try {
    let content = '';

    // 본문 내용 추출 (일반적인 div.content, div.body 등)
    let contentMatch = html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (!contentMatch) {
      contentMatch = html.match(/<div[^>]*class="[^"]*body[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) {
      contentMatch = html.match(/<div[^>]*class="[^"]*text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    }
    if (!contentMatch) {
      contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    }

    if (contentMatch) {
      content = stripHtmlKeepText(contentMatch[1]).trim();
    }

    // 내용이 너무 짧으면 전체 HTML에서 다시 추출 시도
    if (!content || content.length < 20) {
      // 테이블이나 큰 텍스트 블록 찾기
      const mainContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (mainContent) {
        const bodyContent = mainContent[1];
        // 스크립트, 스타일 제거
        const cleaned = bodyContent
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
          .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
        
        // 가장 큰 텍스트 블록 추출
        const textBlocks = cleaned.match(/<div[^>]*>([\s\S]{50,}?)<\/div>/gi);
        if (textBlocks && textBlocks.length > 0) {
          // 가장 큰 블록 선택
          const largestBlock = textBlocks.reduce((a, b) => a.length > b.length ? a : b);
          content = stripHtmlKeepText(largestBlock).trim();
        }
      }
    }

    return {
      content: content || '상세 내용을 불러올 수 없습니다.',
    };
  } catch (error) {
    console.error('Detail parsing error:', error);
    return {
      content: '상세 내용을 불러올 수 없습니다.',
    };
  }
}

/**
 * 특정 공지사항 상세 정보 fetch
 * (선택사항: 특정 공지의 상세 정보만 필요할 때)
 */
async function fetchAndParseNoticeDetail(noticeId) {
  // 이 함수는 미리 추출된 공지 정보가 필요함
  // 실제로는 목록 전체를 다시 파싱해야 함
  // 간단한 구현으로 에러 반환
  return {
    error: 'Use /dorm-notices endpoint to get all notices with details',
  };
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
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
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
